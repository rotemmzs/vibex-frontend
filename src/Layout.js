import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg'; // Adjust the path to your logo file
import './App.css';

function Layout({ children }) {
  return (
    <div>
      <header className="top-nav">
        <Link to="/">
          <img src={logo} alt="VibeX Logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/events">All Events</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/admin">Admin Portal</Link></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
