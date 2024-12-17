import React, { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    Textarea,
    Select,
    Option
} from "@material-tailwind/react";

const RETURN_REASONS = [
    "Damaged product",
    "Wrong product delivered",
    "Product different from description",
    "Size/Fit issue",
    "Quality not as expected",
    "Other"
];

const ReturnReasonModal = ({ open, handleOpen, onSubmit, isLoading }) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const handleSubmit = () => {
        const finalReason = selectedReason === "Other" ? customReason : selectedReason;
        if (!finalReason.trim()) {
            toast.error("Please provide a return reason");
            return;
        }
        onSubmit(finalReason);
    };

    return (
        <Dialog size="sm" open={open} handler={handleOpen}>
            <DialogHeader className="justify-between">
                <Typography variant="h5" color="blue-gray">
                    Return Order Request
                </Typography>
            </DialogHeader>

            <DialogBody className="overflow-y-scroll pr-2">
                <div className="grid gap-6">
                    <div>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                        >
                            Select Return Reason
                        </Typography>
                        <Select
                            label="Return Reason"
                            value={selectedReason}
                            onChange={(value) => setSelectedReason(value)}
                        >
                            {RETURN_REASONS.map((reason) => (
                                <Option key={reason} value={reason}>
                                    {reason}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {selectedReason === "Other" && (
                        <div>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="mb-2 font-medium"
                            >
                                Please specify your reason
                            </Typography>
                            <Textarea
                                label="Custom Reason"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}

                    <Typography
                        variant="small"
                        color="gray"
                        className="mt-2 font-normal"
                    >
                        Note: Return requests can only be made within 7 days of delivery.
                        The product should be in its original condition with all tags and packaging intact.
                    </Typography>
                </div>
            </DialogBody>

            <DialogFooter className="justify-between gap-2">
                <Button 
                    variant="outlined" 
                    color="red" 
                    onClick={handleOpen}
                >
                    Cancel
                </Button>
                <Button 
                    variant="gradient" 
                    color="green" 
                    onClick={handleSubmit}
                    disabled={isLoading || (!selectedReason || (selectedReason === "Other" && !customReason.trim()))}
                >
                    {isLoading ? "Submitting..." : "Submit Return Request"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ReturnReasonModal;