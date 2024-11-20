import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Typography,
} from "@material-tailwind/react";

export function LongDialogEdit({ open, handleOpen, user, onEditSuccess }) {


  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Edit User</DialogHeader>
      <DialogBody className="h-[36rem] overflow-scroll">
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center items-center mb-4 flex-col gap-4">
            {profilePic instanceof File ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="New Preview"
                className="relative w-36 h-36 rounded-full"
              />
            ) : (
              <img
                src={`http://localhost:3000/api${profilePic}`}
                alt="User"
                className="relative w-36 h-36 rounded-full"
              />
            )}
            <Input type="file" onChange={handleImageChange} />
          </div>

          {/* Personal details section */}
          <div className="mb-6 flex flex-col gap-3">
            <Typography variant="h6" className="mb-2">Personal Details</Typography>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            {error.name && <p className="text-red-500 text-xs pl-1 ">{error.name}</p>}
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            {error.username && <p className="text-red-500 text-xs pl-1 ">{error.username}</p>}
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error.email && <p className="text-red-500 text-xs pl-1 ">{error.email}</p>}
          </div>
          <Button onClick={handleEditUser} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>

          {isError && <p className="text-red-500 text-xs">Failed to update user</p>}
        </div>
      </DialogBody>
    </Dialog>
  );
}
