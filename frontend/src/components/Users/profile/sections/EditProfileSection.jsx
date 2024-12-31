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
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useGetUserQuery, useUpdateProfileMutation } from '../../../../../App/features/rtkApis/userApi';
import { useForm } from "react-hook-form";
import { Toaster, toast } from 'sonner';
import { useSelector } from 'react-redux';

const EditProfileSection = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const {data, isLoading, error} = useGetUserQuery();
  const [updateProfile, {error: updateError, isLoading: updateLoading}] = useUpdateProfileMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        const response = await updateProfile({
          name: formData.name,
          phone: formData.phone
        }).unwrap();
        
        if (response) {
          setIsEditing(false);
        }
      }

      if (showPasswordSection) {
        if (formData.newPassword !== formData.confirmPassword) {
          errors.confirmPassword = {
            type: 'manual',
            message: 'Passwords do not match'
          };
          return;
        }

        await updateProfile({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }).unwrap();
        
        reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          name: data.name,
          phone: data.phone
        });
        setShowPasswordSection(false);
      }
      toast.success('Profile Updated Successfully')
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong. Try again')
      console.error('Update failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${currentTheme.primary}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${currentTheme.primary}`}>
        <Typography className={currentTheme.text}>Error loading profile data</Typography>
      </div>
    );
  }

  return (
    <div className={`max-w-3xl mx-auto ${currentTheme.primary}`}>
      <Typography variant="h4" className={`mb-6 ${currentTheme.text}`}>
        Edit Profile
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className={currentTheme.secondary}>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" className={currentTheme.text}>
                Personal Information
              </Typography>
              <Button 
                size="sm" 
                variant="text" 
                className={`flex items-center gap-2 ${currentTheme.text}`}
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
                className={currentTheme.input}
                labelProps={{ className: currentTheme.label }}
                error={errors.name?.message}
                disabled={!isEditing}
              />
              <p className='text-sm text-red-500'>{errors.name?.message}</p>
            </div>
            <Input
              label="Email"
              value={data?.email}
              className={currentTheme.input}
              labelProps={{ className: currentTheme.label }}
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
                className={currentTheme.input}
                labelProps={{ className: currentTheme.label }}
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
            className={`flex items-center gap-2 ${currentTheme.text}`}
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            {showPasswordSection ? 'Cancel' : 'Change Password ?'}
          </Button>
        </div>

        {showPasswordSection && (
          <Card className={currentTheme.secondary}>
            <CardBody className="space-y-4">
              <Typography variant="h6" className={`mb-4 ${currentTheme.text}`}>
                Change Password
              </Typography>

              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("currentPassword", {
                    required: "Current password is required"
                  })}
                  className={currentTheme.input}
                  labelProps={{ className: currentTheme.label }}
                  error={errors.currentPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute right-3 top-[6px] p-1 rounded-full ${currentTheme.iconButton}`}
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                <p className='text-sm text-red-500'>{errors.currentPassword?.message}</p>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long"
                    }
                  })}
                  className={currentTheme.input}
                  labelProps={{ className: currentTheme.label }}
                  error={errors.newPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute right-3 top-[6px] p-1 rounded-full ${currentTheme.iconButton}`}
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                <p className='text-sm text-red-500'>{errors.newPassword?.message}</p>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watch('newPassword') || "Passwords do not match"
                  })}
                  className={currentTheme.input}
                  labelProps={{ className: currentTheme.label }}
                  error={errors.confirmPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-[6px] p-1 rounded-full ${currentTheme.iconButton}`}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                <p className='text-sm text-red-500'>{errors.confirmPassword?.message}</p>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            className={`${currentTheme.button} ${currentTheme.buttonHover} text-black`}
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