import React, { useState, useEffect } from 'react';
import {
  Select,
  Option,
  Input,
  Button,
} from "@material-tailwind/react";
import { 
  useGetSalesReportQuery, 
  useDownloadSalesPDFMutation, 
  useDownloadSalesExcelMutation 
} from '../../../App/features/rtkApis/adminApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { SalesReportTable } from '../../components/Admin/Tabels/SalesReportTable';
import { SummaryCards } from '../../components/Admin/SummaryCards';
import { FilterSection } from '../../components/Admin/FilterSection';
import SalesChart from '../../components/Admin/SalesChart';
import TopSelling from '../../components/Admin/TopSelling';


const Dashboard = () => {
  const [filterType, setFilterType] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Format date to DD/MM/YYYY for display
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format date for API - input is in YYYY-MM-DD format
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';
    // Split the YYYY-MM-DD format
    const [year, month, day] = dateStr.split('-');
    // Return in DD/MM/YYYY format for backend
    return `${day}/${month}/${year}`;
  };

  const { data: salesReport, isLoading, error, refetch } = useGetSalesReportQuery(
    isInitialized && (filterType !== 'custom' || shouldFetch) ? {
      filter: filterType,
      startDate: startDate ? formatDateForAPI(startDate) : '',
      endDate: endDate ? formatDateForAPI(endDate) : '',
      page: currentPage,
      limit: 10
    } : skipToken
  );

  const [downloadPDF, { isLoading: isPdfLoading }] = useDownloadSalesPDFMutation();
  const [downloadExcel, { isLoading: isExcelLoading }] = useDownloadSalesExcelMutation();

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (salesReport?.pagination?.totalPages && currentPage < salesReport.pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

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
    setShouldFetch(false);
    setCurrentPage(1); // Reset to first page
    
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
      case 'yearly': {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(today.getFullYear() - 1);
        setStartDate(yearAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        setShouldFetch(true);
        break;
      }
      case 'custom':
        break;
      default:
        break;
    }
  };

  // Handle apply filter button click
  const handleApplyFilter = () => {
    if (filterType === 'custom') {
      setCurrentPage(1); // Reset to first page when applying custom filter
      setShouldFetch(true);
    }
  };

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
        startDate: startDate ? formatDateForAPI(startDate) : '',
        endDate: endDate ? formatDateForAPI(endDate) : ''
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
        startDate: startDate ? formatDateForAPI(startDate) : '',
        endDate: endDate ? formatDateForAPI(endDate) : ''
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
      <FilterSection 
        filterType={filterType}
        startDate={startDate}
        endDate={endDate}
        onFilterChange={handleFilterChange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApplyFilter={handleApplyFilter}
      />

      {/* Summary Cards */}
      <SummaryCards summaryData={summaryData} />

      <div className="mb-6">
        <SalesChart salesData={salesReport?.salesData || []} filterType={filterType} />
      </div>

      {/* Sales Table */}
      <SalesReportTable 
        salesReport={salesReport}
        isLoading={isLoading}
        error={error}
        handleDownloadPDF={handleDownloadPDF}
        handleDownloadExcel={handleDownloadExcel}
        currentPage={currentPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        isPdfLoading={isPdfLoading}
        isExcelLoading={isExcelLoading}
      />

     <div className='my-6'>
     <TopSelling/>
     </div>
    </div>
  );
};

export default Dashboard;