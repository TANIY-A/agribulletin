import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        {/* <img src="/path/to/logo.png" alt="AgriBulletin" />
        <span className="logo-text">AgriBulletin</span> */}
      </div>
      
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/schemes">Schemes</Link>
        </li>
        <li className="navbar-item">
          <Link to="/complaints">Complaints</Link>
        </li>
        <li className="navbar-item">
          <Link to="/AdminLogin">Admin Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
