'use client';

import Link from 'next/link';
import { Button } from '@repo/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { SignInDialog } from '../auth/SignInDialog';
import { SignUpDialog } from '../auth/SignUpDialog';
import { useAppSelector } from '@/lib/store/hooks';
import Logo from '@/components/common/logo';

export function Navbar() {
  const user = useAppSelector((state) => state.auth.user);

  const handleLogOut = () => {
    fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <nav className="py-4 px-6">
      <div className="flex justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          <Logo className="h-7" />
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/movies">Movies</Link>
          <Link href="/lists">Lists</Link>

          {!user ? (
            <>
              <SignInDialog>
                <Button>Sign In</Button>
              </SignInDialog>

              <SignUpDialog>
                <Button>Create Account</Button>
              </SignUpDialog>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>{user.username}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button onClick={handleLogOut}>Sign Out</Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
