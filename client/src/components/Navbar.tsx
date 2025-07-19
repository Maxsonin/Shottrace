import { useState } from 'react';
import Modal from './Modal';
import PopUpFieldset from './PopUpFieldset';
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
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="font-bold text-lg cursor-pointer">Booklogue</div>

        <ul className="flex space-x-6 font-bold text-white">
          {!user ? (
            <>
              <li
                className="cursor-pointer hover:text-gray-900"
                onClick={() => setOpenSignIn(true)}
              >
                SIGN IN
              </li>
              <li
                className="cursor-pointer hover:text-gray-900"
                onClick={() => setOpenSignUp(true)}
              >
                CREATE ACCOUNT
              </li>
            </>
          ) : (
            <li>
              <Link to={`/${user.username}`}>{user.username}</Link>
            </li>
          )}
          <Link to="/books" className="cursor-pointer hover:text-gray-900">
            BOOKS
          </Link>
          <Link to="/lists" className="cursor-pointer hover:text-gray-900">
            LISTS
          </Link>
        </ul>
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
