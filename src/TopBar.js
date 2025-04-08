import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './TopBar.css';

const TopBar = ({ onLogin, onUserUpdate }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://192.168.64.3:3000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const users = await response.json();
      const loggedInUser = users.find(u => u.username === username) || users[0];
      setUser(loggedInUser);
      onUserUpdate(loggedInUser); // Pass user to parent
    } catch (err) {
      console.error('Fetch user info error:', err);
    }
  };

  const handleSignInClick = () => {
    setShowSignIn(!showSignIn);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.64.3:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign-in failed');
      }
      const data = await response.json();
      onLogin(data.token);
      await fetchUserInfo(data.token);
      setShowSignIn(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    onUserUpdate(null); // Clear user in parent
    onLogin(null);
    navigate('/');
  };

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        {user && user.role === 'admin' && (
          <Link to="/admin" className="admin-button">Admin</Link>
        )}
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Vibex Logo" className="logo" />
          </Link>
          <span className="vibex-title">VibeX</span>
        </div>
        <div className="sign-in-container">
          {user ? (
            <div className="user-profile">
              <button className="user-button" onClick={handleSignInClick}>
                {user.username.charAt(0).toUpperCase()}
              </button>
              <span className="sign-in-text">{user.username}</span>
              {showSignIn && (
                <div className="user-popup">
                  <p><strong>Name:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                  <p><strong>Join Date:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Role:</strong> {user.role || 'N/A'}</p>
                  <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="sign-in-button" onClick={handleSignInClick}></button>
              <span className="sign-in-text">Sign In</span>
              {showSignIn && (
                <div className="sign-in-popup">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label>Username:</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>Password:</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit">Sign In</button>
                    {error && <p className="error">{error}</p>}
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;