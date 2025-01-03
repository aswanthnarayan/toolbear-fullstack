import React, { useState } from 'react';
import { Card, CardBody, Typography, Button, IconButton } from "@material-tailwind/react";
import DefaultBadge from './DefaultBadge';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { AlertModal } from '../../../../components/AlertModal';

const AddressCard = ({ address, onSetDefault, onDelete, onEdit, theme }) => {
  const { _id, fullName, address: streetAddress, area, phone, city, state, pincode, isDefault } = address;
  const [openAlert, setOpenAlert] = useState(false);
  
  const handleOpenAlert = () => setOpenAlert(!openAlert);
  
  const handleDelete = () => {
    onDelete(_id);
    handleOpenAlert();
  };
  
  return (
    <Card className={`relative ${theme.secondary} hover:shadow-lg transition-shadow duration-300`}>
      <CardBody className="p-4">
        {isDefault && (
          <div className="absolute top-2 right-2">
            <DefaultBadge theme={theme} />
          </div>
        )}
        
        <Typography variant="h6" className={`mb-2 ${theme.text}`}>
          {fullName}
        </Typography>
        
        <div className={`space-y-1 mb-4 ${theme.textGray}`}>
          <Typography>{streetAddress}</Typography>
          <Typography>{area}</Typography>
          <Typography>{phone}</Typography>
          <Typography>{`${city}, ${state} ${pincode}`}</Typography>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {!isDefault && (
            <Button
              size="sm"
              className={`flex-1 ${theme.button} ${theme.buttonHover} text-black`}
              onClick={() => onSetDefault(_id)}
            >
              Set as Default
            </Button>
          )}
          <div className="flex gap-1">
            <IconButton
              size="sm"
              onClick={() => onEdit(address)}
              className={`${theme.iconButton.bg}`}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </IconButton>
            <IconButton
              size="sm"
              onClick={handleOpenAlert}
              className={`rounded-full bg-red-500 hover:bg-red-600 p-1`}
            >
              <TrashIcon className="h-4 w-4 text-white" />
            </IconButton>
          </div>
        </div>
      </CardBody>
      <AlertModal 
        open={openAlert}
        handleOpen={handleOpenAlert}
        heading="Delete Address"
        message="Are you sure you want to delete this address?"
        confirmText="Delete"
        confirmColor="red"
        onConfirm={handleDelete}
        theme={theme}
      />
    </Card>
  );
};

export default AddressCard;