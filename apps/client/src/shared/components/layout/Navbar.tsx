import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

function Navbar() {
  const navItemClass = 'uppercase cursor-pointer hover:text-gray-300';

  const {
    user,
    loading,
    signOut,
    openSignInDialog: openSignInModal,
    openSignUpDialog: openSignUpModal,
  } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed', error);
      alert('Sign out failed');
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
                  <li className={navItemClass} onClick={openSignInModal}>
                    Sign In
                  </li>
                  <li className={navItemClass} onClick={openSignUpModal}>
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
                    <a onClick={() => handleSignOut()} className={navItemClass}>
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
    </>
  );
}

export default Navbar;
