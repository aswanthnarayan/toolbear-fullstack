import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import { useGetWalletQuery } from '../../../../../App/features/rtkApis/userApi';
import Pagination from '../../Pagination';
import { useSelector } from 'react-redux';

const WalletSection = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [page, setPage] = useState(1);
  const { data: wallet, isLoading } = useGetWalletQuery({ 
    page, 
    limit: 5 
  });

  if (isLoading) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${currentTheme.primary}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const getTransactionColor = (transaction) => {
    if (transaction.type === 'credit' || transaction.description.toLowerCase().includes('refund')) {
      return 'green';
    }
    return 'red';
  };

  const getTransactionPrefix = (transaction) => {
    if (transaction.type === 'credit' || transaction.description.toLowerCase().includes('refund')) {
      return '+';
    }
    return '-';
  };

  return (
    <div className={`space-y-4 ${currentTheme.primary}`}>
      {/* Wallet Balance */}
      <Card className={currentTheme.secondary}>
        <CardBody>
          <Typography variant="h5" className={`mb-4 ${currentTheme.text}`}>
            Wallet Balance
          </Typography>
          <Typography variant="h3" className={currentTheme.text}>
            ₹{wallet?.balance || 0}
          </Typography>
        </CardBody>
      </Card>

      {/* Transaction History */}
      <Card className={currentTheme.secondary}>
        <CardBody>
          <Typography variant="h5" className={`mb-4 ${currentTheme.text}`}>
            Transaction History
          </Typography>
          <div className="space-y-4">
            {wallet?.transactions?.map((transaction, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center p-4 rounded-lg ${currentTheme.hover} transition-colors duration-200`}
              >
                <div>
                  <Typography variant="h6" className={currentTheme.text}>
                    {transaction.description}
                  </Typography>
                  <Typography className={`text-sm ${currentTheme.textGray}`}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip
                  value={`${getTransactionPrefix(transaction)}₹${Math.abs(transaction.amount)}`}
                  color={getTransactionColor(transaction)}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {wallet?.transactions?.length > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={wallet?.pagination?.totalPages}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo(0, 0);
                }}
                theme={currentTheme}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default WalletSection;