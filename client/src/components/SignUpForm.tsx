import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { signUp } from '../api/authService';

function SignUpForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await signUp({ email, username, password });
      setToken(data.accessToken);
      setUser(data.user);
      onClose();
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUpForm;
