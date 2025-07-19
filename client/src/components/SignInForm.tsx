import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { signIn } from '../api/authService';

function SignInForm({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await signIn({ username, password });
      setToken(data.accessToken);
      setUser(data.user);
      onClose();
    } catch (error) {
      alert('Signin failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="username"
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
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignInForm;
