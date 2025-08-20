import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import SignInForm from '@/features/auth/components/SignInForm';
import SignUpForm from '@/features/auth/components/SignUpForm';
import { signOut } from '@/features/auth/services/authService';

import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Navbar() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const navItemClass = 'uppercase cursor-pointer hover:text-gray-300';

  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      alert('signOut failed');
    }
  };

  return (
    <>
      <nav className="text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="uppercase font-bold text-lg cursor-pointer">
            Shottrace
          </div>

          {!loading && (
            <ul className="flex space-x-6 font-bold">
              {!user ? (
                <>
                  <li
                    className={navItemClass}
                    onClick={() => setOpenSignIn(true)}
                  >
                    Sign In
                  </li>
                  <li
                    className={navItemClass}
                    onClick={() => setOpenSignUp(true)}
                  >
                    Create Account
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to={`/${user.username}`}
                      className="cursor-pointer hover:text-gray-300"
                    >
                      {user.username}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={handleSignOut}
                      className={navItemClass}
                    >
                      Sign Out
                    </a>
                  </li>
                </>
              )}
              <li>
                <Link to="/movies" className={navItemClass}>
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/lists" className={navItemClass}>
                  Lists
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {openSignIn && (
        <Dialog open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <DialogTitle>
            Sign In
            <IconButton
              aria-label="close"
              onClick={() => setOpenSignIn(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <SignInForm onClose={() => setOpenSignIn(false)} />
          </DialogContent>
        </Dialog>
      )}

      {openSignUp && (
        <Dialog open={openSignUp} onClose={() => setOpenSignUp(false)}>
          <DialogTitle>
            Create Account
            <IconButton
              aria-label="close"
              onClick={() => setOpenSignUp(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <SignUpForm onClose={() => setOpenSignUp(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default Navbar;
