import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@/shared/components/ui/Modal';
import PopUpFieldset from '@/shared/components/ui/PopUpFieldset';
import { useAuth } from '@/app/providers/AuthProvider';
import SignInForm from '@/features/auth/components/SignInForm';
import SignUpForm from '@/features/auth/components/SignUpForm';
import { signOut } from '@/features/auth/services/authService';

function Navbar() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const { user } = useAuth();

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

          <ul className="flex space-x-6 font-bold">
            {!user ? (
              <>
                <li
                  className="uppercase cursor-pointer hover:text-gray-300"
                  onClick={() => setOpenSignIn(true)}
                >
                  Sign In
                </li>
                <li
                  className="uppercase cursor-pointer hover:text-gray-300"
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
                    className="uppercase hover:text-gray-300"
                  >
                    {user.username}
                  </Link>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={handleSignOut}
                    className="uppercase cursor-pointer hover:text-gray-300"
                  >
                    Sign Out
                  </a>
                </li>
              </>
            )}
            <li>
              <Link
                to="/movies"
                className="uppercase cursor-pointer hover:text-gray-300"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                to="/lists"
                className="uppercase cursor-pointer hover:text-gray-300"
              >
                Lists
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {openSignIn && (
        <PopUpFieldset open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <SignInForm onClose={() => setOpenSignIn(false)} />
        </PopUpFieldset>
      )}

      {openSignUp && (
        <Modal
          open={openSignUp}
          onClose={() => setOpenSignUp(false)}
          title="Join Shottrace"
        >
          <SignUpForm onClose={() => setOpenSignUp(false)} />
        </Modal>
      )}
    </>
  );
}

export default Navbar;
