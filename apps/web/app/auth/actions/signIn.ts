export async function signIn(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const res = await fetch(`http://localhost:3000/auth/signin`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  return await res.json();
}
