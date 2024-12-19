import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Select,
  Option,
  Input,
  Button,
} from "@material-tailwind/react";
import { 
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  TagIcon,
  DocumentArrowDownIcon 
} from "@heroicons/react/24/solid";
import { 
  useGetSalesReportQuery, 
  useDownloadSalesPDFMutation, 
  useDownloadSalesExcelMutation 
} from '../../../App/features/rtkApis/adminApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [filterType, setFilterType] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: salesReport, isLoading, error, refetch } = useGetSalesReportQuery(
    isInitialized && (filterType !== 'custom' || shouldFetch) 
      ? { filter: filterType, startDate, endDate } 
      : skipToken
  );

  const [downloadPDF, { isLoading: isPdfLoading }] = useDownloadSalesPDFMutation();
  const [downloadExcel, { isLoading: isExcelLoading }] = useDownloadSalesExcelMutation();

  console.log(salesReport);

  // Initialize dates on component mount
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setStartDate(todayStr);
    setEndDate(todayStr);
    setIsInitialized(true);
  }, []);

  // Handle filter changes
  const handleFilterChange = (value) => {
    setFilterType(value);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (value) {
      case 'daily':
        setStartDate(todayStr);
        setEndDate(todayStr);
        setShouldFetch(true);
        break;
      case 'weekly': {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        setStartDate(weekAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        setShouldFetch(true);
        break;
      }
      case 'monthly': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        setStartDate(monthAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        setShouldFetch(true);
        break;
      }
      case 'custom':
        setShouldFetch(false);
        break;
      default:
        break;
    }
  };

  // Handle apply filter button click
  const handleApplyFilter = () => {
    if (filterType === 'custom') {
      setShouldFetch(true);
    }
  };

  // Refetch when dates change
  useEffect(() => {
    if (isInitialized && startDate && endDate && filterType !== 'custom') {
      refetch();
    }
  }, [startDate, endDate, isInitialized, filterType, refetch]);

  // Calculate summary data
  const summaryData = {
    totalSales: salesReport?.summary?.totalSales || 0,
    totalAmount: salesReport?.summary?.totalAmount || 0,
    totalDiscount: salesReport?.summary?.totalDiscount || 0
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await downloadPDF({ 
        filter: filterType, 
        startDate, 
        endDate 
      }).unwrap();
      
      // Create blob with correct MIME type
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales-report-${filterType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF report downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF report');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await downloadExcel({ 
        filter: filterType, 
        startDate, 
        endDate 
      }).unwrap();
      
      // Create blob with correct MIME type
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales-report-${filterType}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Excel report downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast.error('Failed to download Excel report');
    }
  };

  return (
    <div className="p-6">
      {/* Filter Controls */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select 
          label="Filter Type" 
          value={filterType}
          onChange={handleFilterChange}
        >
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="yearly">Yearly</Option>
          <Option value="custom">Custom Date</Option>
        </Select>

        {filterType === 'custom' && (
          <>
            <Input 
              type="date" 
              label="Start Date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input 
              type="date" 
              label="End Date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleApplyFilter}
                className="bg-blue-500"
              >
                Apply Filter
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-full p-3 bg-blue-100">
              <ShoppingCartIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Overall Sales Count
              </Typography>
              <Typography variant="h4">
                {summaryData.totalSales}
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-full p-3 bg-green-100">
              <CurrencyRupeeIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Overall Order Amount
              </Typography>
              <Typography variant="h4">
                ₹{summaryData.totalAmount}
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-full p-3 bg-orange-100">
              <TagIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Overall Discount
              </Typography>
              <Typography variant="h4">
                ₹{summaryData.totalDiscount}
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Sales Table */}
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" color="blue-gray">
              Sales Report
            </Typography>
            <div className="flex gap-4 mt-4">
              <Button
                className="flex items-center gap-2 bg-blue-500"
                onClick={handleDownloadPDF}
                disabled={isPdfLoading}
              >
                {isPdfLoading ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    Downloading PDF...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                className="flex items-center gap-2 bg-green-500"
                onClick={handleDownloadExcel}
                disabled={isExcelLoading}
              >
                {isExcelLoading ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    Downloading Excel...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    Download Excel
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          {error ? (
            <div className="flex justify-center items-center p-4 text-red-500">
              Error loading sales data. Please try again.
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center p-4">
              <Typography>Loading sales data...</Typography>
            </div>
          ) : salesReport?.data?.length === 0 ? (
            <div className="flex justify-center items-center p-4">
              <Typography>No sales data found for the selected period.</Typography>
            </div>
          ) : (
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {[
                    "Order ID",
                    "Date",
                    "Customer Name",
                    "Customer Email",
                    "Items",
                    "Total Amount",
                    "Discount",
                    "Status"
                  ].map((head) => (
                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesReport?.data?.map((sale, index) => (
                  <tr key={sale.orderId} className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {sale.orderId}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {sale.date}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {sale.customerName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {sale.customerEmail}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {sale.numberOfItems}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        ₹{sale.totalAmount}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        ₹{sale.discount}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {sale.status}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;