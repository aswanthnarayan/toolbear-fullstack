import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Radio,
} from "@material-tailwind/react";
import { PlusIcon, CreditCardIcon, TrashIcon } from "@heroicons/react/24/solid";

const PaymentMethodsSection = () => {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'visa',
      number: '****-****-****-1234',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      number: '****-****-****-5678',
      expiry: '06/24',
      isDefault: false,
    },
  ]);

  const handleOpen = () => setOpen(!open);

  const handleDelete = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleSetDefault = (cardId) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId,
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" color="blue-gray">
          Payment Methods
        </Typography>
        <Button
          className="flex items-center gap-2"
          onClick={handleOpen}
          variant="gradient"
        >
          <PlusIcon className="h-5 w-5" /> Add New Card
        </Button>
      </div>

      <div className="grid gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="w-full">
            <CardBody className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <CreditCardIcon className="h-8 w-8 text-blue-gray-500" />
                <div>
                  <Typography variant="h6" color="blue-gray">
                    {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                  </Typography>
                  <Typography color="gray" className="text-sm">
                    {card.number} • Expires {card.expiry}
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {!card.isDefault && (
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => handleSetDefault(card.id)}
                  >
                    Set as Default
                  </Button>
                )}
                {card.isDefault && (
                  <Typography
                    variant="small"
                    color="blue"
                    className="font-medium"
                  >
                    Default
                  </Typography>
                )}
                <Button
                  size="sm"
                  variant="text"
                  color="red"
                  onClick={() => handleDelete(card.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Add New Card</DialogHeader>
        <DialogBody divider>
          <form className="grid gap-4">
            <Input label="Card Number" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date" />
              <Input label="CVV" type="password" />
            </div>
            <Input label="Cardholder Name" />
            <div className="flex items-center gap-2">
              <Radio name="type" label="Credit Card" defaultChecked />
              <Radio name="type" label="Debit Card" />
            </div>
          </form>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            Add Card
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default PaymentMethodsSection;