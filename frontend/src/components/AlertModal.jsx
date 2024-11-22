import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

export function AlertModal({
  open = false,
  handleOpen,
  heading = "Alert",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red", // red, green, blue etc.
  cancelColor = "gray",
  onConfirm,
  onCancel,
  size = "xs", // xs, sm, md, lg, xl
  loading = false,
  icon = null,
}) {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size={size}
      className="bg-white shadow-md rounded-lg"
    >
      <DialogHeader className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <Typography variant="h5" color="blue-gray">
          {heading}
        </Typography>
      </DialogHeader>

      <DialogBody divider className="grid place-items-center gap-4">
        <Typography className="text-center text-blue-gray-500">
          {message}
        </Typography>
      </DialogBody>

      <DialogFooter className="space-x-2">
        <Button
          variant="text"
          color={cancelColor}
          onClick={() => {
            handleOpen();
            onCancel?.();
          }}
          className="mr-1"
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant="gradient"
          color={confirmColor}
          onClick={() => {
            onConfirm?.();
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </div>
          ) : (
            confirmText
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}