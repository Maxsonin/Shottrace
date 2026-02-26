export async function signUp(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
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

export function signUpWithGoogle() {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}
