import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-[background,backdrop-filter] duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-white/80 dark:bg-gray-950/80'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
          StudyPal
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right section: avatar + hamburger */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <Link
              to={ROUTES.profile}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:ring-2 hover:ring-purple-400 dark:hover:ring-purple-500 transition-all"
              title={user.username}
            >
              <span className="text-sm font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </Link>
          )}

          {/* Hamburger button (mobile) */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 rounded"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md">
          <div className="flex flex-col px-4 py-4 gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 rounded px-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
