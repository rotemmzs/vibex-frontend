import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App"; // Assuming your main component is App.js
import AdminLogin from "./AdminLogin";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default Main;
