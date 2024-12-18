import React from 'react';
import {
  Typography,
  Card,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import { useGetWalletQuery } from '../../../../../App/features/rtkApis/userApi';

const WalletSection = () => {
  const { data: wallet, isLoading } = useGetWalletQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          
          {wallet?.transactions && wallet.transactions.length > 0 ? (
            <div className="space-y-4">
              {wallet.transactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {transaction.description}
                    </Typography>
                    <Typography variant="small" color="gray">
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant="h6" color={transaction.type === 'debit' ? 'red' : 'green'}>
                      {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount}
                    </Typography>
                    <Chip
                      size="sm"
                      variant="ghost"
                      value={transaction.type}
                      color={transaction.type === 'debit' ? 'red' : 'green'}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Typography color="gray">No transactions yet</Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default WalletSection;