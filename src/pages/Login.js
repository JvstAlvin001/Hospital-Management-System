import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        // This is the specific fix for case-sensitivity
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      
      // Force refresh so Navbar appears instantly
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginCard}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>MegaLife Login</h2>
          <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Enter credentials to access hospital system</p>
        </div>

        {error && (
          <div style={errorBox}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              style={inputStyle} 
              placeholder="doctor@megalife.com"
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><Lock size={16} /> Password</label>
            <input 
              type="password" 
              style={inputStyle} 
              placeholder="••••••••"
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" style={loginBtn}>
            <LogIn size={18} /> Login to System
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' };
const loginCard = { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' };
const headerStyle = { textAlign: 'center', marginBottom: '30px' };
const inputGroup = { marginBottom: '20px' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' };
const loginBtn = { width: '100%', padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const errorBox = { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' };

export default Login;