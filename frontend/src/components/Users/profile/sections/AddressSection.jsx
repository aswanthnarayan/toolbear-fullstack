import React, { useState } from 'react';
import { Button, Spinner, Typography } from "@material-tailwind/react";
import AddressCard from '../shared/AddressCard';
import AddAddressModal from '../shared/AddAddressModal';
import { 
  useGetAddressesQuery, 
  useSetDefaultAddressMutation,
  useDeleteAddressMutation 
} from '../../../../../App/features/rtkApis/userApi';
import { useSelector } from 'react-redux';

const AddressSection = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
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
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${currentTheme.primary}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${currentTheme.primary}`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-semibold ${currentTheme.text}`}>
          Your Addresses
        </h2>
        {addresses?.length < 5 ? (
          <Button
            className={`${currentTheme.button} ${currentTheme.buttonHover} text-black`}
            onClick={handleOpenModal}
          >
            Add New Address
          </Button>
        ) : (
          <Typography className="text-sm text-red-500">
            Maximum address limit (5) reached
          </Typography>
        )}
      </div>

      <AddAddressModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editAddress={editingAddress}
        theme={currentTheme}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses?.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onSetDefault={() => handleSetDefault(address._id)}
            onDelete={() => handleDelete(address._id)}
            onEdit={handleEdit}
            theme={currentTheme}
          />
        ))}
      </div>
    </div>
  );
};

export default AddressSection;