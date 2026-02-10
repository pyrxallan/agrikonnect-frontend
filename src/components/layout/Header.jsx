import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-lg bg-gradient-to-r from-gray-900 to-gray-400">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/agrikkonect-logo.png" alt="Agrikonnect" className="h-16" />
          </Link>

          <button
            className="md:hidden p-2 rounded-md text-white hover:bg-white/10"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-secondary transition-colors font-medium">
              Home
            </Link>
            <Link to="/posts" className="text-white hover:text-secondary transition-colors font-medium">
              Posts
            </Link>
            <Link to="/communities" className="text-white hover:text-secondary transition-colors font-medium">
              Communities
            </Link>
            <Link to="/experts" className="text-white hover:text-secondary transition-colors font-medium">
              Experts
            </Link>
            <Link to="/weather" className="text-white hover:text-secondary transition-colors font-medium">
              Weather
            </Link>
              {token && user && (
                <Link to="/messages" className="text-white hover:text-secondary transition-colors font-medium">
                  Messages
                </Link>
              )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <>
                <span className="text-white text-sm">Welcome, {user.first_name}!</span>
                <Link
                  to="/profile"
                  className="text-white hover:text-secondary transition-colors font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary px-5 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-white hover:text-secondary hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/posts" 
                className="text-white hover:text-secondary hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Posts
              </Link>
              <Link 
                to="/communities" 
                className="text-white hover:text-secondary hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Communities
              </Link>
              <Link 
                to="/experts" 
                className="text-white hover:text-secondary hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Experts
              </Link>
              
              <div className="pt-4 border-t border-white/20 space-y-2">
                {token && user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="block btn-secondary text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full btn-secondary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block btn-secondary text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="block btn-primary text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
                  {token && user && (
                    <Link 
                      to="/messages" 
                      className="text-white hover:text-secondary hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Messages
                    </Link>
                  )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;