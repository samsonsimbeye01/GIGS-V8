import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">GigApp</Link>

        <ul className="navbar-nav">
          <li><Link to="/">Home</Link></li>
          {user && <li><Link to="/dashboard">Dashboard</Link></li>}
          <li><a href="#gigs">Gigs</a></li>
        </ul>

        <div className="navbar-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            🌙
          </button>

          {user ? (
            <div className="user-menu">
              <div className="user-avatar" onClick={() => setShowDropdown(!showDropdown)}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <button 
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '0.75rem 1rem', color: 'var(--error)' }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
