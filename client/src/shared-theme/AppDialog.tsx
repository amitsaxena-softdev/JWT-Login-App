import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type DialogType = "info" | "warning" | "error" | "success" | "confirm";

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
  showActions?: boolean;
}

export default function AppDialog({
  open,
  onClose,
  onConfirm,
  title = "Notification",
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "info",
  showActions = true,
}: AppDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "400px",
            height: "250px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: type === "error"
            ? "error.main"
            : type === "warning"
            ? "warning.main"
            : type === "success"
            ? "success.main"
            : "primary.main",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
      >
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      {showActions && (
        <DialogActions>
          {type === "confirm" && (
            <Button onClick={onClose} color="primary">
              {cancelText}
            </Button>
          )}
          <Button
            onClick={onConfirm ?? onClose}
            color={type === "error" ? "error" : "primary"}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
