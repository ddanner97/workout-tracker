import { Button } from '../component-library';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteWorkoutDialogProps {
  open: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteWorkoutDialog({
  open,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteWorkoutDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete workout?</DialogTitle>
      <DialogContent>
        <DialogContentText>This cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          label="Cancel"
          variant="outlined"
          size="small"
          onClick={onClose}
          disabled={isDeleting}
        />
        <Button
          label="Delete"
          variant="contained"
          size="small"
          color="error"
          onClick={onConfirm}
          disabled={isDeleting}
        />
      </DialogActions>
    </Dialog>
  );
}
