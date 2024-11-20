import React, { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, Typography, Input } from "@material-tailwind/react";

export function LongDialog({ open, handleOpen, onAddSuccess }) {


  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Add New User</DialogHeader>
      <DialogBody className="h-[36rem] overflow-scroll">
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center items-center mb-4 flex-col gap-4">
            <img 
              src=''
              alt="User" className="relative w-36 h-36 rounded-full" 
            />
            <Input type="file"  />
          </div>
          <div className="mb-6">
            <Typography variant="h6" className="mb-2">Personal Details</Typography>
            <div className="flex flex-col space-y-4">
              <Input 
                label="Name" 
                name="name" 
              />
              
              <Input 
                label="Username" 
                name="username" 
              />
              
              <Input 
                label="Email" 
                name="email" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Typography variant="h6">Enter Password</Typography>
            <Input 
              type="password" 
              label="Password" 
              name="password" 
            />
            
            <Input 
              type="password" 
              label="Confirm Password" 
              name="confirmPassword" 
            />
            
            <Button  className="mt-4">Create User</Button>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
}
