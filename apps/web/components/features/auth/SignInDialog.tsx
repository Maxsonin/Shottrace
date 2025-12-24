'use client';

import { signIn } from '@/app/auth/actions/signIn';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@repo/ui/dialog';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { useAppDispatch } from '@/lib/store/hooks';
import { setUser } from '@/lib/store/features/auth/authSlice';

export function SignInDialog({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const user = await signIn(formData);
      dispatch(setUser(user));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Email</Label>
              <Input name="email" placeholder="example@domain.com" />
            </div>

            <div className="grid gap-3">
              <Label>Password</Label>
              <Input name="password" type="password" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Sign In</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
