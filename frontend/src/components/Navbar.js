import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken, isAuthenticated } from '../services/auth';
import { userAPI } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      loadUser();
    }
  }, [authenticated]);

  const loadUser = async () => {
    try {
      const response = await userAPI.getMe();
      setUser(response.data);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate('/login');
  };

  if (!authenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/songs" className="navbar-brand">
          🎵 Music App
        </Link>
        <div className="navbar-links">
          <Link to="/songs" className="nav-link">
            Songs
          </Link>
          <Link to="/playlists" className="nav-link">
            My Playlists
          </Link>
          {user && (
            <span className="user-info">Welcome, {user.username}!</span>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

