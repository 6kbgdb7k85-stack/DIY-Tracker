import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function ConfirmationDialog({
  resource,
  confirmCallback = () => {},
  open,
  setOpen,
  customMessage,
}) {
  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle align="center">Confirm Delete</DialogTitle>
      <DialogContent>
        {customMessage ? (
          <Typography align="center" variant="body1">
            {customMessage}
          </Typography>
        ) : (
          <>
            <Typography align="center" variant="body1">
              You are about to delete {resource?.resourceType} "{resource?.name}
              ". Are you sure you want to proceed?
            </Typography>
            <Typography align="center" variant="body1">
              This action cannot be undone.
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            confirmCallback(resource.id);
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
