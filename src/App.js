import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './TopBar';
import EventTimeline from './EventTimeline';
import AdminPortal from './AdminPortal';
import Login from './Login';
import Footer from './Footer';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [user, setUser] = useState(null); // Add user state

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleUserUpdate = (userData) => {
    setUser(userData); // Update user state
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app-container">
        <TopBar onLogin={handleLogin} onUserUpdate={handleUserUpdate} />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<EventTimeline searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} user={user} />}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPortal token={token} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;