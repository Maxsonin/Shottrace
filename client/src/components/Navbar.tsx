import { useState } from 'react';
import Modal from './UI/Modal';
import PopUpFieldset from './UI/PopUpFieldset';
import { useAuth } from '../providers/AuthProvider';
import { Link } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

function Navbar() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="font-bold text-lg cursor-pointer">Booklogue</div>

          <ul className="flex space-x-6 font-bold">
            {!user ? (
              <>
                <li
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setOpenSignIn(true)}
                >
                  SIGN IN
                </li>
                <li
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setOpenSignUp(true)}
                >
                  CREATE ACCOUNT
                </li>
              </>
            ) : (
              <li>
                <Link to={`/${user.username}`} className="hover:text-gray-300">
                  {user.username}
                </Link>
              </li>
            )}
            <li>
              <Link to="/books" className="cursor-pointer hover:text-gray-300">
                BOOKS
              </Link>
            </li>
            <li>
              <Link to="/lists" className="cursor-pointer hover:text-gray-300">
                LISTS
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
          title="JOIN BOOKLOGUE"
        >
          <SignUpForm onClose={() => setOpenSignUp(false)} />
        </Modal>
      )}
    </>
  );
}

export default Navbar;
