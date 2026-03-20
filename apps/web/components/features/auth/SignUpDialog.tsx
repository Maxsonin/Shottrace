'use client';

import { signUp, signUpWithGoogle } from '@/app/auth/actions/signUp';
import { setUser } from '@/lib/store/features/auth/authSlice';
import { useAppDispatch } from '@/lib/store/hooks';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@repo/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { Separator } from '@repo/ui/separator';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  email: z.email('Invalid email'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(25, 'Username must be less than 25 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function SignUpDialog({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setServerError(null);

      const user = await signUp(data);
      dispatch(setUser(user));
      window.location.reload();
    } catch (err: any) {
      const message = err.message || 'Something went wrong';

      if (message.toLowerCase().includes('email')) {
        setError('email', { message });
      } else if (message.toLowerCase().includes('username')) {
        setError('username', { message });
      } else {
        setServerError(message);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Join Shottrace</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input {...register('email')} placeholder="example@domain.com" />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Username</Label>
              <Input {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Password</Label>
              <Input {...register('password')} type="password" />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="text-sm text-red-500 mt-3">{serverError}</p>
          )}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>

        <Separator text={'or'} />

        <Button onClick={signUpWithGoogle}>
          <FontAwesomeIcon icon={faGoogle} />
          Sign Up with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
