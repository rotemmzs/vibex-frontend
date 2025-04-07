import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import EventTimeline from './EventTimeline';
import AdminPortal from './AdminPortal';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<EventTimeline />} />
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
      </Layout>
    </Router>
  );
}

export default App;