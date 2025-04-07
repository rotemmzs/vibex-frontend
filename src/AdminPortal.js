import React, { useState, useEffect } from 'react';

const AdminPortal = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [editingUser, setEditingUser] = useState(null);

  // Fetch the user list when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://192.168.64.3:3000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Create a new user
  const handleCreateUser = async () => {
    try {
      const response = await fetch('http://192.168.64.3:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
      });
      if (!response.ok) throw new Error('Failed to create user');
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing user
  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const response = await fetch(`http://192.168.64.3:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Failed to update user');
      const updatedUser = await response.json();
      setUsers(users.map(user => (user.id === userId ? updatedUser : user)));
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://192.168.64.3:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Portal</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Create New User</h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <input
            type="text"
            value={editingUser.username}
            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
          />
          <select
            value={editingUser.role}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => handleUpdateUser(editingUser.id, { username: editingUser.username, role: editingUser.role })}>
            Save
          </button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;