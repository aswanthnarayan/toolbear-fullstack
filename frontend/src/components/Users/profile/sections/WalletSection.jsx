import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import { useGetWalletQuery } from '../../../../../App/features/rtkApis/userApi';
import Pagination from '../../Pagination';

const WalletSection = () => {
  const [page, setPage] = useState(1);
  const { data: wallet, isLoading } = useGetWalletQuery({ 
    page, 
    limit: 5 
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
    <div className="space-y-4">
      {/* Wallet Balance */}
      <Card>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Wallet Balance
          </Typography>
          <Typography variant="h3" color="blue-gray">
            ₹{wallet?.balance || 0}
          </Typography>
        </CardBody>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Transaction History
          </Typography>
          <div className="space-y-4">
            {wallet?.transactions?.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <Typography variant="h6">{transaction.description}</Typography>
                  <Typography color="gray" className="text-sm">
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
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default WalletSection;