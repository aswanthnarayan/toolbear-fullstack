import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";

const WalletSection = () => {
  const balance = 500.00;
  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 100.00,
      description: 'Refund - Order #ORD123',
      date: '2023-12-07',
    },
    {
      id: 2,
      type: 'debit',
      amount: 299.99,
      description: 'Purchase - Order #ORD456',
      date: '2023-12-05',
    },
    {
      id: 3,
      type: 'credit',
      amount: 50.00,
      description: 'Cashback Reward',
      date: '2023-12-03',
    },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Wallet
      </Typography>

      <Card className="bg-gradient-to-r from-blue-500 to-blue-600">
        <CardBody className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <WalletIcon className="h-8 w-8 text-white" />
            <Typography variant="h6" color="white">
              Available Balance
            </Typography>
          </div>
          <Typography variant="h3" color="white" className="mb-4">
            ₹{balance.toFixed(2)}
          </Typography>
          <Button
            size="sm"
            variant="filled"
            className="bg-white text-blue-500 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" /> Add Money
          </Button>
        </CardBody>
      </Card>

      <div>
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Recent Transactions
        </Typography>
        <Card>
          <List>
            {transactions.map((transaction) => (
              <ListItem key={transaction.id} className="py-4">
                <ListItemPrefix>
                  {transaction.type === 'credit' ? (
                    <ArrowUpIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 text-red-500" />
                  )}
                </ListItemPrefix>
                <div className="flex-grow">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {transaction.description}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                </div>
                <ListItemSuffix>
                  <Chip
                    value={`${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toFixed(2)}`}
                    color={transaction.type === 'credit' ? 'green' : 'red'}
                    variant="ghost"
                    size="sm"
                  />
                </ListItemSuffix>
              </ListItem>
            ))}
          </List>
        </Card>
      </div>
    </div>
  );
};

export default WalletSection;