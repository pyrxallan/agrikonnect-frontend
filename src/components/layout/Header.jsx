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
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Agrikonnect
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation - desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/posts" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Posts
            </Link>
            <Link to="/communities" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Communities
            </Link>
            <Link to="/experts" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Experts
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <>
                <span className="text-gray-700 text-sm">Welcome, {user.first_name}!</span>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
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

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/posts" 
                className="text-gray-700 hover:text-primary hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Posts
              </Link>
              <Link 
                to="/communities" 
                className="text-gray-700 hover:text-primary hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Communities
              </Link>
              <Link 
                to="/experts" 
                className="text-gray-700 hover:text-primary hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Experts
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
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
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;