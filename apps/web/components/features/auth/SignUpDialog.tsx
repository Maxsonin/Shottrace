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

export function SignUpDialog({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const user = await signUp(formData);
      dispatch(setUser(user));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // TODO: add schema validation and React Hook Form
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Shottrace</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email-1">Email</Label>
              <Input
                id="email-1"
                name="email"
                placeholder="example@domain.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password-1">Password</Label>
              <Input id="password-1" name="password" type="password" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Account</Button>
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
