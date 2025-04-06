import React, { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://192.168.64.3:3000/admin/login", {
        username,
        password,
      });
      setMessage(response.data.message);
      // Redirect or handle success (e.g., store token, navigate to admin dashboard)
    } catch (error) {
      setMessage("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminLogin;
