import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // 1. Clear any old session data first
      localStorage.clear(); 

      // 2. Save NEW session data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // 3. Normalize the role for comparison
      const userRole = res.data.user.role?.toLowerCase() || 'guest';

      // 4. Map-based Routing
      const roleRoutes = {
        admin: '/dashboard',
        doctor: '/appointment-manager',
        nurse: '/appointment-manager',
        patient: '/records'
      };

      // 5. Execute Navigation
      const targetPath = roleRoutes[userRole] || '/records';

      console.log(`🔐 Access Granted | Role: ${userRole} | Destination: ${targetPath}`);
      navigate(targetPath);

    } catch (err) {
      alert('Login Failed: ' + (err.response?.data?.msg || 'Server Error'));
    }
  }; // Fixed missing closing brace here

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h1>Megalife HMS</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" name="email" placeholder="Staff Email" onChange={onChange} required style={inputStyle} />
        <input type="password" name="password" placeholder="Password" onChange={onChange} required style={inputStyle} />
        <button type="submit" style={btnStyle}>Login to System</button>
      </form>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Login;