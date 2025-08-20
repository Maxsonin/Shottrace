import { useState } from 'react';
import { signUp } from '../services/authService';
import { TextField, Button, Box } from '@mui/material';

function SignUpForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp({ email, username, password });
      window.location.href = '/';
      onClose();
    } catch (error) {
      console.error(error);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 300,
        p: 2,
      }}
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </Box>
  );
}

export default SignUpForm;
