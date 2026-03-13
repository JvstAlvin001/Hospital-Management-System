import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // 1. Get the user data we saved in Login.js
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. Logout function
  const handleLogout = () => {
    localStorage.clear(); // Wipe the token and role
    navigate('/login');    // Send back to login
  };

  // 3. If no user is logged in, don't show the navbar at all
  if (!user) return null;

  const role = user.role?.toLowerCase();

  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Megalife HMS</div>
      
      <div style={linksStyle}>
        {/* Links for EVERYONE who is logged in */}
        <Link to="/" style={linkItem}>Home</Link>

        {/* Links only for ADMIN */}
        {role === 'admin' && (
          <Link to="/dashboard" style={linkItem}>Admin Stats</Link>
        )}

        {/* Links for DOCTORS and NURSES */}
        {(role === 'admin' || role === 'doctor' || role === 'nurse') && (
          <Link to="/appointment-manager" style={linkItem}>Appointments</Link>
        )}

        {/* Links for BILLING */}
        {(role === 'admin' || role === 'accountant') && (
          <Link to="/billing" style={linkItem}>Billing</Link>
        )}

        <button onClick={handleLogout} style={logoutBtn}>Logout ({user.name})</button>
      </div>
    </nav>
  );
};

// Simple Styles
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#007bff', color: 'white', alignItems: 'center' };
const linksStyle = { display: 'flex', gap: '20px', alignItems: 'center' };
const linkItem = { color: 'white', textDecoration: 'none', fontWeight: '500' };
const logoutBtn = { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' };

export default Navbar;