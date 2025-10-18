import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignInForm from '@/features/auth/components/SignInForm';

type Props = {
  onClose: () => void;
};

export default function SignInDialog({ onClose }: Props) {
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        Sign In
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SignInForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
