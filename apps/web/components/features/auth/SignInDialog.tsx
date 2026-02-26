'use client';

import { signIn, signInWithGoogle } from '@/app/auth/actions/signIn';
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
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Separator } from '@repo/ui/separator';

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
    // TODO: add schema validation and React Hook Form
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

        <Separator text={'or'} />

        <Button onClick={signInWithGoogle}>
          <FontAwesomeIcon icon={faGoogle} />
          Sign In with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
