import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Lock, Briefcase, ShieldCheck } from 'lucide-react';

const AddStaff = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Nurse' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/add-staff', formData, {
        headers: { 'x-auth-token': token }
      });
      alert(res.data.msg);
      setFormData({ name: '', email: '', password: '', role: 'Nurse' });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add staff");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCard}>
        <div style={headerStyle}>
          <ShieldCheck size={28} color="#e74c3c" />
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Add New Staff</h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
          Create credentials for new hospital employees.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}><UserPlus size={14} /> Full Name</label>
            <input 
              style={inputStyle} 
              type="text" 
              placeholder="e.g. Jane Smith"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><Mail size={14} /> Official Email</label>
            <input 
              style={inputStyle} 
              type="email" 
              placeholder="jane@megalife.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><Lock size={14} /> Temporary Password</label>
            <input 
              style={inputStyle} 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><Briefcase size={14} /> Staff Role</label>
            <select 
              style={inputStyle} 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Nurse">Nurse</option>
              <option value="Doctor">Doctor</option>
              <option value="Accountant">Accountant</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" style={submitBtn}>Register Staff Member</button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '110px 20px', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center' };
const formCard = { backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' };
const inputGroup = { marginBottom: '20px' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' };
const submitBtn = { width: '100%', backgroundColor: '#2c3e50', color: 'white', border: 'none', padding: '14px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: '0.2s' };

export default AddStaff;