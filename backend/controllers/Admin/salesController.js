import Order from '../../models/OrderSchema.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

// Helper function to parse date string in DD/MM/YYYY format
const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day); // month is 0-based in JavaScript
};

// Get sales report data
export const getSalesReport = async (req, res) => {
    try {
        const { filter, startDate, endDate } = req.body;
        
        let dateFilter = {};
        const currentDate = new Date();
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Set up date filter based on selected filter type
        if (filter === 'daily') {
            dateFilter = { 
                createdAt: { 
                    $gte: startOfDay,
                    $lte: endOfDay 
                } 
            };
        } else if (filter === 'weekly') {
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(currentDate.getDate() - 7);
            weekStartDate.setHours(0, 0, 0, 0);
            dateFilter = { 
                createdAt: { 
                    $gte: weekStartDate,
                    $lte: endOfDay 
                } 
            };
        } else if (filter === 'monthly') {
            const monthStartDate = new Date(currentDate);
            monthStartDate.setMonth(currentDate.getMonth() - 1);
            monthStartDate.setHours(0, 0, 0, 0);
            dateFilter = { 
                createdAt: { 
                    $gte: monthStartDate,
                    $lte: endOfDay 
                } 
            };
        } else if (filter === 'custom' && startDate && endDate) {
            const customStartDate = parseDateString(startDate);
            const customEndDate = parseDateString(endDate);
            
            if (!customStartDate || !customEndDate) {
                return res.status(400).json({ 
                    message: 'Invalid date format. Please use DD/MM/YYYY format.' 
                });
            }

            customStartDate.setHours(0, 0, 0, 0);
            customEndDate.setHours(23, 59, 59, 999);
            
            dateFilter = {
                createdAt: {
                    $gte: customStartDate,
                    $lte: customEndDate
                }
            };
        }

        // Add delivered status to filter
        dateFilter.status = 'Delivered';

        const orders = await Order.find(dateFilter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean();

        // Calculate summary statistics based on filtered orders
        const totalSales = orders.length;
        const totalAmount = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalDiscount = orders.reduce((sum, order) => {
            const originalPrice = order.products.reduce((total, product) => 
                total + (product.priceAtPurchase * product.quantity), 0);
            return sum + (originalPrice - order.totalAmount);
        }, 0);
        
        // Format orders for table display
        const salesData = orders.map(order => ({
            orderId: order._id,
            date: new Date(order.createdAt).toLocaleDateString(),
            customerName: order.userId?.name || 'N/A',
            customerEmail: order.userId?.email || 'N/A',
            numberOfItems: order.products.reduce((sum, product) => sum + product.quantity, 0),
            totalAmount: order.totalAmount,
            discount: order.products.reduce((total, product) => 
                total + (product.priceAtPurchase * product.quantity), 0) - order.totalAmount,
            status: order.status
        }));

        // Calculate period-specific stats based on the filtered data
        let periodStats = {
            todaySales: 0,
            weeklySales: 0,
            monthlySales: 0
        };

        // Only calculate period stats if we have orders
        if (orders.length > 0) {
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(currentDate.getDate() - 7);
            weekStartDate.setHours(0, 0, 0, 0);
            
            const monthStartDate = new Date(currentDate);
            monthStartDate.setMonth(currentDate.getMonth() - 1);
            monthStartDate.setHours(0, 0, 0, 0);

            // Calculate period stats from filtered orders
            periodStats = {
                todaySales: orders.reduce((sum, order) => 
                    order.createdAt >= startOfDay && order.createdAt <= endOfDay
                        ? sum + order.totalAmount : sum, 0),
                weeklySales: orders.reduce((sum, order) => 
                    order.createdAt >= weekStartDate && order.createdAt <= endOfDay
                        ? sum + order.totalAmount : sum, 0),
                monthlySales: orders.reduce((sum, order) => 
                    order.createdAt >= monthStartDate && order.createdAt <= endOfDay
                        ? sum + order.totalAmount : sum, 0)
            };
        }

        res.status(200).json({
            success: true,
            data: salesData,
            summary: {
                totalSales,
                totalAmount,
                totalDiscount,
                ...periodStats
            },
            filter: filter || '',
            startDate: startDate || '',
            endDate: endDate || ''
        });
    } catch (error) {
        console.error('Sales Report Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sales report',
            error: error.message
        });
    }
};

// Download sales report as PDF
export const downloadSalesPDF = async (req, res) => {
    try {
        const { filter = 'daily', startDate, endDate } = req.body;
        
        let dateFilter = { status: 'Delivered' };
        const currentDate = new Date();
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Set up date filter based on selected filter type
        if (filter === 'daily') {
            dateFilter.createdAt = { 
                $gte: startOfDay,
                $lte: endOfDay 
            };
        } else if (filter === 'weekly') {
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(currentDate.getDate() - 7);
            weekStartDate.setHours(0, 0, 0, 0);
            dateFilter.createdAt = { 
                $gte: weekStartDate,
                $lte: endOfDay 
            };
        } else if (filter === 'monthly') {
            const monthStartDate = new Date(currentDate);
            monthStartDate.setMonth(currentDate.getMonth() - 1);
            monthStartDate.setHours(0, 0, 0, 0);
            dateFilter.createdAt = { 
                $gte: monthStartDate,
                $lte: endOfDay 
            };
        } else if (filter === 'custom' && startDate && endDate) {
            const customStartDate = parseDateString(startDate);
            const customEndDate = parseDateString(endDate);
            
            if (!customStartDate || !customEndDate) {
                return res.status(400).json({ 
                    message: 'Invalid date format. Please use DD/MM/YYYY format.' 
                });
            }

            customStartDate.setHours(0, 0, 0, 0);
            customEndDate.setHours(23, 59, 59, 999);
            
            dateFilter.createdAt = {
                $gte: customStartDate,
                $lte: customEndDate
            };
        }

        const orders = await Order.find(dateFilter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        const doc = new PDFDocument();

        // Set response headers before piping
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=sales-report-${filter}.pdf`);
        
        doc.pipe(res);

        // Add header
        doc.fontSize(20).text('Sales Report', { align: 'center' });
        doc.moveDown();

        // Add filter information
        const filterText = filter.charAt(0).toUpperCase() + filter.slice(1);
        doc.fontSize(12).text(`Filter: ${filterText}`);
        
        // Add date range information
        let dateRangeText = '';
        if (filter === 'custom' && startDate && endDate) {
            dateRangeText = `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
        } else if (filter === 'daily') {
            dateRangeText = new Date().toLocaleDateString();
        } else if (filter === 'weekly') {
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - 7);
            dateRangeText = `${weekStart.toLocaleDateString()} to ${currentDate.toLocaleDateString()}`;
        } else if (filter === 'monthly') {
            const monthStart = new Date(currentDate);
            monthStart.setMonth(currentDate.getMonth() - 1);
            dateRangeText = `${monthStart.toLocaleDateString()} to ${currentDate.toLocaleDateString()}`;
        }
        
        doc.text(`Period: ${dateRangeText}`);
        doc.moveDown();

        // Add summary
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        doc.text(`Total Orders: ${orders.length}`);
        doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`);
        doc.moveDown();

        // Add report content
        doc.text('Order Details:', { underline: true });
        doc.moveDown();

        orders.forEach(order => {
            doc.text(`Order ID: ${order._id}`);
            doc.text(`Customer: ${order.userId?.name || 'N/A'} (${order.userId?.email || 'N/A'})`);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
            doc.text(`Total Amount: ₹${order.totalAmount}`);
            doc.text(`Products:`);
            order.products.forEach(product => {
                doc.text(`  - Quantity: ${product.quantity}, Price: ₹${product.priceAtPurchase}`);
            });
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Sales PDF Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating PDF report',
            error: error.message
        });
    }
};

// Download sales report as Excel
export const downloadSalesExcel = async (req, res) => {
    try {
        const { filter = 'daily', startDate, endDate } = req.body;
        
        let dateFilter = { status: 'Delivered' };
        const currentDate = new Date();
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Set up date filter based on selected filter type
        if (filter === 'daily') {
            dateFilter.createdAt = { 
                $gte: startOfDay,
                $lte: endOfDay 
            };
        } else if (filter === 'weekly') {
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(currentDate.getDate() - 7);
            weekStartDate.setHours(0, 0, 0, 0);
            dateFilter.createdAt = { 
                $gte: weekStartDate,
                $lte: endOfDay 
            };
        } else if (filter === 'monthly') {
            const monthStartDate = new Date(currentDate);
            monthStartDate.setMonth(currentDate.getMonth() - 1);
            monthStartDate.setHours(0, 0, 0, 0);
            dateFilter.createdAt = { 
                $gte: monthStartDate,
                $lte: endOfDay 
            };
        } else if (filter === 'custom' && startDate && endDate) {
            const customStartDate = parseDateString(startDate);
            const customEndDate = parseDateString(endDate);
            
            if (!customStartDate || !customEndDate) {
                return res.status(400).json({ 
                    message: 'Invalid date format. Please use DD/MM/YYYY format.' 
                });
            }

            customStartDate.setHours(0, 0, 0, 0);
            customEndDate.setHours(23, 59, 59, 999);
            
            dateFilter.createdAt = {
                $gte: customStartDate,
                $lte: customEndDate
            };
        }

        const orders = await Order.find(dateFilter)
            .populate('userId', 'name email')
            .populate('products.productId', 'name price')
            .sort({ createdAt: -1 })
            .lean();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        // Add report info
        worksheet.addRow(['Sales Report']);
        worksheet.addRow([`Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`]);
        worksheet.addRow([`Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`]);
        worksheet.addRow([]);

        // Add summary
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        worksheet.addRow(['Summary']);
        worksheet.addRow(['Total Orders', orders.length]);
        worksheet.addRow(['Total Amount', `₹${totalAmount.toFixed(2)}`]);
        worksheet.addRow([]);

        // Define columns
        worksheet.addRow([
            'Order ID',
            'Date',
            'Customer Name',
            'Customer Email',
            'Product',
            'Quantity',
            'Unit Price',
            'Total'
        ]);

        // Add order details
        orders.forEach(order => {
            if (order.products && order.products.length > 0) {
                order.products.forEach(product => {
                    worksheet.addRow([
                        order._id.toString(),
                        new Date(order.createdAt).toLocaleDateString(),
                        order.userId?.name || 'N/A',
                        order.userId?.email || 'N/A',
                        product.productId?.name || 'N/A',
                        product.quantity,
                        product.priceAtPurchase,
                        product.quantity * product.priceAtPurchase
                    ]);
                });
            }
        });

        // Style the worksheet
        worksheet.getRow(1).font = { bold: true, size: 14 };
        worksheet.getRow(8).font = { bold: true };
        worksheet.columns.forEach(column => {
            column.width = 15;
        });

        // Generate filename with date range
        const filename = `sales-report-${startDate}-to-${endDate}.xlsx`;

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error exporting sales report:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting sales report',
            error: error.message
        });
    }
};
