import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { UserCircleIcon, CameraIcon } from "@heroicons/react/24/solid";

const EditProfileSection = () => {
  const [formData, setFormData] = useState({
    firstName: 'Aswanth',
    lastName: 'C K',
    email: 'aswanth@example.com',
    phone: '+91 9876543210',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardBody className="space-y-4">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Personal Information
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Change Password
            </Typography>

            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </CardBody>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outlined" color="red">
            Cancel
          </Button>
          <Button type="submit" variant="gradient" color="blue">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileSection;