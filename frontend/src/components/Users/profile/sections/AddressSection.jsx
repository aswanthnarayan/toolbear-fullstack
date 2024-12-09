import React, { useState } from 'react';
import { Button, Typography } from "@material-tailwind/react";
import AddressCard from '../shared/AddressCard';
import AddAddressModal from '../shared/AddAddressModal';
import { 
  useGetAddressesQuery, 
  useSetDefaultAddressMutation,
  useDeleteAddressMutation 
} from '../../../../../App/features/rtkApis/userApi';

const AddressSection = () => {
  const { data: addresses, isLoading } = useGetAddressesQuery();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingAddress(null);
  };

  if (isLoading) {
    return <div>Loading addresses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Your Addresses</h2>
        {addresses?.length < 5 ? (
          <Button
            className="flex items-center gap-2"
            onClick={handleOpenModal}
            variant="gradient"
          >
            Add New Address
          </Button>
        ) : (
          <Typography color="red" className="text-sm">
            Maximum address limit (5) reached
          </Typography>
        )}
      </div>

      <AddAddressModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editAddress={editingAddress}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses?.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onSetDefault={() => handleSetDefault(address._id)}
            onDelete={() => handleDelete(address._id)}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default AddressSection;