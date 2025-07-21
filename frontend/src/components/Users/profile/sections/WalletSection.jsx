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
import CustomSpinner from '../../../utils/CustomSpinner';

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
      <CustomSpinner/>
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
        <CardBody className="p-4 sm:p-6">
          <Typography variant="h5" className={`mb-2 sm:mb-4 text-lg sm:text-xl ${currentTheme.text}`}>
            Wallet Balance
          </Typography>
          <Typography variant="h3" className={`text-2xl sm:text-3xl md:text-4xl ${currentTheme.text}`}>
            ₹{wallet?.balance || 0}
          </Typography>
        </CardBody>
      </Card>

      {/* Transaction History */}
      <Card className={currentTheme.secondary}>
        <CardBody className="p-4 sm:p-6">
          <Typography variant="h5" className={`mb-3 sm:mb-4 text-lg sm:text-xl ${currentTheme.text}`}>
            Transaction History
          </Typography>
          <div className="space-y-3">
            {wallet?.transactions?.map((transaction, index) => (
              <div 
                key={index} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg ${currentTheme.hover} transition-colors duration-200`}
              >
                <div className="flex-1 min-w-0">
                  <Typography variant="h6" className={`${currentTheme.text} text-sm sm:text-base break-words`}>
                    {transaction.description}
                  </Typography>
                  <Typography className={`text-xs sm:text-sm ${currentTheme.textGray}`}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip
                  value={`${getTransactionPrefix(transaction)}₹${Math.abs(transaction.amount)}`}
                  color={getTransactionColor(transaction)}
                  className="text-xs sm:text-sm h-6 sm:h-7 w-fit"
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {wallet?.transactions?.length > 0 && (
            <div className="mt-4 sm:mt-6 w-full overflow-x-auto">
              <div className="min-w-[300px] max-w-full mx-auto pb-2">
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
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default WalletSection;