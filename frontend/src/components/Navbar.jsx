import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout, username } = useAuth();
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-md border-b border-forest-500/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-forest-700 transition-colors">
            <span className="text-cream-50 text-sm font-bold font-mono">C</span>
          </div>
          <span className="font-display text-lg text-forest-800 font-semibold tracking-tight">
            Community<span className="text-forest-500 font-normal italic"> Board</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!isAdmin && (
            <Link to="/" className="text-sm font-body text-forest-600 hover:text-forest-800 transition-colors">
              Announcements
            </Link>
          )}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {!isAdmin && (
                <Link to="/admin" className="btn-secondary text-xs py-2 px-4">
                  Admin Panel
                </Link>
              )}
              {isAdmin && (
                <Link to="/" className="btn-secondary text-xs py-2 px-4">
                  Public View
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-forest-600 rounded-full flex items-center justify-center">
                  <span className="text-cream-50 text-xs font-semibold">{username?.[0]?.toUpperCase()}</span>
                </div>
                <button onClick={logout} className="text-xs text-rust-500 hover:text-rust-600 transition-colors font-body">
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/admin/login" className="btn-primary text-xs py-2 px-4">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
