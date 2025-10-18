import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignUpForm from '@/features/auth/components/SignUpForm';

type Props = {
  onClose: () => void;
};

export default function SignUpDialog({ onClose }: Props) {
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        Create Account
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SignUpForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
