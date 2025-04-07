import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './TopBar';
import EventTimeline from './EventTimeline';
import AdminPortal from './AdminPortal';
import Login from './Login';
import Footer from './Footer'; // Import the Footer component
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app-container">
        <TopBar onLogin={handleLogin} />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<EventTimeline searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} />}
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
        <Footer /> {/* Add the Footer component */}
      </div>
    </Router>
  );
}

export default App;