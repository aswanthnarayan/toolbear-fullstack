import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ salesData, filterType }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Analytics',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)',
        },
      },
      x: {
        title: {
          display: true,
          text: filterType === 'daily' ? 'Days' : filterType === 'monthly' ? 'Months' : 'Years',
        },
      },
    },
  };

  const formatDate = (dateString) => {
    // Handle DD/MM/YYYY format
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return new Date(year, month - 1, day);
    }
    
    // Handle ISO format or other date strings
    return new Date(dateString);
  };

  const processData = () => {
    if (!salesData || !salesData.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Sales Amount',
          data: [],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
        }],
      };
    }

    // Sort data by date
    const sortedData = [...salesData].sort((a, b) => {
      const dateA = formatDate(a.date);
      const dateB = formatDate(b.date);
      return dateA - dateB;
    });

    // Extract labels (dates) and values (total amounts)
    const labels = sortedData.map(item => {
      try {
        const date = formatDate(item.date);
        
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', item.date);
          return 'Invalid Date';
        }

        if (filterType === 'daily') {
          return date.toLocaleDateString('en-US', { 
            day: '2-digit',
            month: 'short'
          });
        } else if (filterType === 'monthly') {
          return date.toLocaleDateString('en-US', { 
            month: 'short',
            year: 'numeric'
          });
        } else {
          return date.getFullYear().toString();
        }
      } catch (error) {
        console.warn('Error formatting date:', item.date, error);
        return 'Invalid Date';
      }
    });

    const values = sortedData.map(item => Number(item.totalAmount) || 0);

    return {
      labels,
      datasets: [{
        label: 'Sales Amount',
        data: values,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      }],
    };
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="h-[400px]">
        <Bar options={options} data={processData()} />
      </div>
    </div>
  );
};

export default SalesChart;