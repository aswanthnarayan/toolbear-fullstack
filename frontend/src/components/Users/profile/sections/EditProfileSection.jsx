import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import { CameraIcon, PencilIcon } from "@heroicons/react/24/solid";
import {useGetUserQuery,useUpdateProfileMutation} from '../../../../../App/features/rtkApis/userApi'
import { useForm } from "react-hook-form";
import { Toaster, toast } from 'sonner';


const EditProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const {data, isLoading, error} = useGetUserQuery();
  const [updateProfile, {error: updateError, isLoading: updateLoading}] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,

  } = useForm({
    defaultValues: {
      name: data?.name || '',
      phone: data?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Update form default values when data is loaded
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        phone: data.phone
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      if (isEditing) {
        // Update profile information
        const response = await updateProfile({
          name: formData.name,
          phone: formData.phone
        }).unwrap();
        
        if (response) {
          setIsEditing(false);
        }
      }

      if (showPasswordSection) {
        // Validate password fields
        if (formData.newPassword !== formData.confirmPassword) {
          errors.confirmPassword = {
            type: 'manual',
            message: 'Passwords do not match'
          };
          return;
        }

        // Update password
        await updateProfile({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }).unwrap();
        
        // Reset password fields and close section
        reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordSection(false);
      }
      toast.success('Profile Updated Successfully')
    } catch (err) {
      toast.error('Something went wrong. Try again')
      console.error('Update failed:', err);
    }
  };

  if (isLoading) {
    return <Spinner className="mx-auto" />;
  }

  if (error) {
    return <div>Error loading profile data</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Edit Profile
      </Typography>

      <div className="mb-8 flex flex-col items-center">
        <div className="relative">
          <Avatar
            size="xxl"
            variant="circular"
            className="cursor-pointer border-2 border-blue-500"
            src="https://docs.material-tailwind.com/img/face-2.jpg"
            alt="avatar"
          />
          <Button
            size="sm"
            color="blue-gray"
            className="absolute bottom-0 right-0 rounded-full p-2"
          >
            <CameraIcon className="h-4 w-4" />
          </Button>
        </div>
        <Typography color="gray" className="mt-2">
          Change Profile Picture
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" color="blue-gray">
                Personal Information
              </Typography>
              <Button 
                size="sm" 
                variant="text" 
                className="flex items-center gap-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                <PencilIcon className="h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            <div>
            <Input
              label="Name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters long" },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Name can only contain letters and spaces"
                },
                validate: (value) => value.trim() !== "" || "Name cannot be empty or spaces only",
              })}
              error={errors.name?.message}
              disabled={!isEditing}
            />
              <p className='text-sm text-red-500 '>{errors.name?.message}</p>
            </div>
            <Input
              label="Email"
              value={data?.email}
              disabled={true}
            />
            <div>
            <Input
              label="Phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
              })}
              error={errors.phone?.message}
              disabled={!isEditing}
            />
              <p className='text-sm text-red-500'>{errors.phone?.message}</p>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="text"
            color="blue"
            className="flex items-center gap-2"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            {showPasswordSection ? 'Cancel' : 'Change Password ?'}
          </Button>
        </div>

        {showPasswordSection && (
          <Card>
            <CardBody className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Change Password
              </Typography>

              <div>
              <Input
                label="Current Password"
                type="password"
                {...register("currentPassword", {
                  required: "Current password is required"
                })}
                error={errors.currentPassword?.message}
              />
              <p className='text-sm text-red-500'>{errors.currentPassword?.message}</p>
              </div>
              <div>
              <Input
                label="New Password"
                type="password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long"
                  },
                  // pattern: {
                  //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  //   message: "Password must contain at least one letter and one number"
                  // }
                })}
                error={errors.newPassword?.message}
              />
              <p className='text-sm text-red-500'>{errors.newPassword?.message}</p>
              </div>
              <div>
              <Input
                label="Confirm New Password"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch('newPassword') || "Passwords do not match"
                })}
                error={errors.confirmPassword?.message}
              />
              <p className='text-sm text-red-500'>{errors.confirmPassword?.message}</p>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          {(updateError || error) && (
            <Typography color="red" className="text-sm">
              {updateError?.data?.message || error?.data?.message || "An error occurred"}
            </Typography>
          )}
          <Button 
            type="submit" 
            variant="gradient" 
            color="blue" 
            disabled={(!isEditing && !showPasswordSection) || updateLoading}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
      <Toaster richColors position="top-right" />

    </div>
  );
};

export default EditProfileSection;