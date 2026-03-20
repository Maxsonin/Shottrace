import { SignUpDto } from '@repo/api';

export async function signUp(data: SignUpDto) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

export function signUpWithGoogle() {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}
