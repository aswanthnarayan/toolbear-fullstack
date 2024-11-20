import React from 'react';
import { Typography, Card } from '@material-tailwind/react';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';

const AdminSigninComponent = () => {

  return (
    <div className="flex h-auth-h">
      <div className="flex justify-center items-center w-full md:w-1/2 p-2 md:p-4">
        <Card className="w-full max-w-md p-3 shadow-2xl py-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Typography variant="h3" className="text-3xl text-center mb-6">ADMIN LOGIN</Typography>

            {/* Username Input */}
            <CustomInput 
              type="text" 
              placeholder="Enter Your Username" 
              name="username" 
              value=''
              onChange=''
            />

            {/* Password Input */}
            <CustomInput 
              type="password" 
              placeholder="Enter Your Password" 
              name="password"
              value=''
              onChange='' 
            />

            {/* General Error (Invalid credentials) */}

            {/* Sign In Button */}
            <CustomButton type="submit"  className="mt-4 w-full" >
              'SIGN IN'
            </CustomButton>
          </form>
        </Card>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-1/2 h-full">
        <img 
          src='' 
          alt="Background" 
          className="object-cover w-full h-full" 
        />
      </div>
    </div>
  );
};

export default AdminSigninComponent;
