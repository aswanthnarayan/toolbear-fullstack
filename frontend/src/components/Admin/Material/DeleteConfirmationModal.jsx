// DialogDefault.jsx
import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DialogDefault({ open, handleOpen, userName, onConfirm }) {
  return (
    <Dialog  open={open} handler={handleOpen}>
      <DialogHeader>Deleting User</DialogHeader>
      <DialogBody>
        You are about to delete the user {userName}. Please be aware that this action is irreversible. Once deleted, all associated data will be permanently lost.
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="green" onClick={handleOpen} className="mr-1">
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="red" onClick={onConfirm}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
