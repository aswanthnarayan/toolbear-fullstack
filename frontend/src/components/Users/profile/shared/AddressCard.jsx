import React, { useState } from 'react';
import { Card, CardBody, Typography, Button, IconButton } from "@material-tailwind/react";
import DefaultBadge from './DefaultBadge';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { AlertModal } from '../../../../components/AlertModal';

const AddressCard = ({ address, onSetDefault, onDelete, onEdit }) => {
  const { _id, fullName, address: streetAddress, area, phone, city, state, pincode, isDefault } = address;
  const [openAlert, setOpenAlert] = useState(false);
  
  const handleOpenAlert = () => setOpenAlert(!openAlert);
  
  const handleDelete = () => {
    onDelete(_id);
    handleOpenAlert();
  };
  
  return (
    <Card className="relative">
      <CardBody className="p-4">
        {isDefault && (
          <div className="absolute top-2 right-2">
            <DefaultBadge />
          </div>
        )}
        
        <Typography variant="h6" color="blue-gray" className="mb-2">
          {fullName}
        </Typography>
        
        <div className="space-y-1 text-gray-700 mb-4">
          <Typography>{streetAddress}</Typography>
          <Typography>{area}</Typography>
          <Typography>{phone}</Typography>
          <Typography>{`${city}, ${state} ${pincode}`}</Typography>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {!isDefault && (
            <Button
              size="sm"
              variant="outlined"
              color="green"
              onClick={() => onSetDefault(_id)}
              className="flex-1"
            >
              Set as Default
            </Button>
          )}
          <div className="flex gap-1">
            <IconButton
              variant="text"
              color="blue-gray"
              size="sm"
              onClick={() => onEdit(address)}
              className="rounded-full"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </IconButton>
            <IconButton
              variant="text"
              color="red"
              size="sm"
              onClick={handleOpenAlert}
              className="rounded-full"
            >
              <TrashIcon className="h-4 w-4" />
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
      />
    </Card>
  );
};

export default AddressCard;