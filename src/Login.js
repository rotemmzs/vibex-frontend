import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending login request to:', 'http://192.168.64.3:3000/api/auth/login');
      const response = await fetch('http://192.168.64.3:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      console.log('Token received:', data.token);
      onLogin(data.token); // Pass the token to App.js
      setError(null);
      console.log('Redirecting to /admin');
      navigate('/admin'); // Trigger the redirect
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Sign-In</h1>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;