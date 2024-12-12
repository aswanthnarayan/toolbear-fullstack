import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useAddAddressMutation, useUpdateAddressMutation } from '../../../../../App/features/rtkApis/userApi';

const AddAddressModal = ({ isOpen, onClose, editAddress = null }) => {
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when editAddress changes or modal opens
  useEffect(() => {
    if (editAddress) {
      reset({
        fullName: editAddress.fullName,
        address: editAddress.address,
        area: editAddress.area,
        phone: editAddress.phone,
        city: editAddress.city,
        state: editAddress.state,
        pincode: editAddress.pincode
      });
    } else {
      reset();
    }
  }, [editAddress, reset]);

  const onSubmit = async (data) => {
    try {
      if (editAddress) {
        await updateAddress({ id: editAddress._id, ...data });
      } else {
        await addAddress(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="md">
      <DialogHeader>{editAddress ? 'Edit Address' : 'Add New Address'}</DialogHeader>
      <DialogBody 
        // divider 
        className="overflow-y-auto max-h-[80vh] "
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <Input
              label="Full Name"
              {...register("fullName", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              validate: (value) => value.trim() !== "" || "Name cannot be empty or spaces only"
              })}
              error={!!errors.fullName}
            />
            {errors.fullName && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.fullName.message}
              </Typography>
            )}
          </div>

          <div>
            <Textarea
              label="Street Address"
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 6,
                  message: "Address must be at least 6 characters",
                },
              validate: (value) => value.trim() !== "" || "Address cannot be empty or spaces only"

              })}
              error={!!errors.address}
            />
            {errors.address && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.address.message}
              </Typography>
            )}
          </div>

          <div>
            <Input
              label="Area/Locality"
              {...register("area", {
                required: "Area is required",
                minLength: {
                  value: 3,
                  message: "Area must be at least 3 characters",
                },
              validate: (value) => value.trim() !== "" || "Area cannot be empty or spaces only"

              })}
              error={!!errors.area}
            />
            {errors.area && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.area.message}
              </Typography>
            )}
          </div>

          <div>
            <Input
              label="Phone Number"
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid phone number. Must be 10 digits starting with 6-9",
                },
              })}
              error={!!errors.phone}
            />
            {errors.phone && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.phone.message}
              </Typography>
            )}
          </div>

          <div>
            <Input
              label="City"
              {...register("city", {
                required: "City is required",
                minLength: {
                  value: 2,
                  message: "City must be at least 2 characters",
                },
              validate: (value) => value.trim() !== "" || "City cannot be empty or spaces only"
              })}
              error={!!errors.city}
            />
            {errors.city && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.city.message}
              </Typography>
            )}
          </div>

          <div>
            <Input
              label="State"
              {...register("state", {
                required: "State is required",
                minLength: {
                  value: 3,
                  message: "State must be at least 3 characters",
                },
              validate: (value) => value.trim() !== "" || "State cannot be empty or spaces only"

              })}
              error={!!errors.state}
            />
            {errors.state && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.state.message}
              </Typography>
            )}
          </div>

          <div>
            <Input
              label="PIN Code"
              type="tel"
              {...register("pincode", {
                required: "PIN Code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "PIN Code must be 6 digits",
                },
              })}
              error={!!errors.pincode}
            />
            {errors.pincode && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.pincode.message}
              </Typography>
            )}
          </div>

          <DialogFooter>
            <Button variant="text" color="red" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" color="green">
              {editAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default AddAddressModal;