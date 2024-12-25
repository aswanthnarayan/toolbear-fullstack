import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";

export function SalesReportTable({ 
  salesReport, 
  isLoading, 
  error, 
  handleDownloadPDF, 
  handleDownloadExcel,
  isPdfLoading,
  isExcelLoading,
  currentPage,
  handlePrevPage,
  handleNextPage
}) {
  return (
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
        ) : !salesReport?.data || salesReport.data.length === 0 ? (
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
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {sale.orderId}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {sale.date ? (() => {
                        const [day, month, year] = sale.date.split('/');
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                      })() : 'N/A'}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {sale.customerName}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {sale.customerEmail}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {sale.numberOfItems}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      ₹{sale.totalAmount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      ₹{sale.discount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {sale.status}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {salesReport?.currentPage} of {salesReport?.totalPages}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            ({salesReport?.totalSales} total sales)
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === salesReport?.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}