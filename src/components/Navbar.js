import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Database, 
  ClipboardList, 
  CreditCard, 
  LogOut 
} from 'lucide-react';

const Navbar = () => {
  const userRole = localStorage.getItem('userRole'); // Get role for hiding links

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>
        <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>
          MegaLife Hospital
        </h2>
      </div>

      <div style={linksContainer}>
        <Link to="/dashboard" style={navLinkStyle}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        
        {/* Only Admins can register new patients */}
        {userRole === 'Admin' && (
          <Link to="/register-patient" style={navLinkStyle}>
            <UserPlus size={18} /> Register Patient
          </Link>
        )}

        <Link to="/records" style={navLinkStyle}>
          <Database size={18} /> Patient Records
        </Link>

        <Link to="/appointment-manager" style={navLinkStyle}>
          <ClipboardList size={18} /> Appointment Manager
        </Link>

        {/* Only Admins or Accountants see Billing */}
        {(userRole === 'Admin' || userRole === 'Accountant') && (
          <Link to="/billing" style={navLinkStyle}>
            <CreditCard size={18} /> Billing
          </Link>
        )}
      </div>

      <button onClick={handleLogout} style={logoutBtnStyle}>
        <LogOut size={16} /> Logout
      </button>
    </nav>
  );
};

const navbarStyle = { backgroundColor: '#ffffff', height: '70px', width: '100%', position: 'fixed', top: 0, left: 0, display: 'flex', alignItems: 'center', padding: '0 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 1000, boxSizing: 'border-box', borderBottom: '1px solid #e2e8f0' };
const logoStyle = { marginRight: '50px' };
const linksContainer = { display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 };
const navLinkStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', padding: '10px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' };
const logoutBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' };

export default Navbar;