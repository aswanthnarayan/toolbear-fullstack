import React, { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Button,
} from "@material-tailwind/react";

const ORDER_STATUSES = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for delivery",
    "Delivered",
    "Cancelled",
    "Returned"
];

const OrderUpdateSelect = ({ order, onUpdateStatus }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        setIsOpen(true);
    };

    const handleConfirm = async () => {
        try {
            await onUpdateStatus(order._id, selectedStatus);
            alert('Status updated successfully!');
        } catch (error) {
            alert('Failed to update status. Please try again.');
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <>
            <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="border rounded-md p-2 "
                disabled={order.status === "Delivered"||order.status === "Cancelled"}
            >
                {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status} disabled={status === order.status}>
                        {status}
                    </option>
                ))}
            </select>

            <Dialog open={isOpen} handler={() => setIsOpen(false)} size="xs">
                <DialogHeader>Confirm Status Update</DialogHeader>
                <DialogBody>
                    <Typography>Are you sure you want to change the status to "{selectedStatus}"?</Typography>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button variant="gradient" color="green" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default OrderUpdateSelect;