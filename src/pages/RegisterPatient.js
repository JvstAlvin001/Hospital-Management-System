import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, User, Phone, MapPin, Calendar, ClipboardList, CheckCircle, AlertCircle } from 'lucide-react';

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    phoneNumber: '', // FIXED: Changed from 'contact' to 'phoneNumber' to match backend
    address: '',
    medicalHistory: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear messages
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/patients/register', formData, {
        headers: { 'x-auth-token': token }
      });
      
      setMessage({ type: 'success', text: 'Patient registered successfully!' });
      // Reset form
      setFormData({ fullName: '', dob: '', gender: '', phoneNumber: '', address: '', medicalHistory: '' });
    } catch (err) {
      console.error("Reg Error:", err.response?.data);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.msg || 'Registration failed. Please check required fields.' 
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCard}>
        <div style={headerStyle}>
          <UserPlus size={28} color="#3498db" />
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Register New Patient</h2>
        </div>

        {message.text && (
          <div style={message.type === 'success' ? successMsg : errorMsg}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formGrid}>
          {/* Full Name */}
          <div style={inputGroup}>
            <label style={labelStyle}><User size={14} /> Full Name</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" style={inputStyle} required />
          </div>

          {/* Phone Number - FIXED NAME ATTRIBUTE */}
          <div style={inputGroup}>
            <label style={labelStyle}><Phone size={14} /> Contact Number</label>
            <input 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              placeholder="e.g. 0712345678" 
              style={inputStyle} 
              required 
            />
          </div>

          {/* Date of Birth */}
          <div style={inputGroup}>
            <label style={labelStyle}><Calendar size={14} /> Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} required />
          </div>

          {/* Gender */}
          <div style={inputGroup}>
            <label style={labelStyle}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div style={{ ...inputGroup, gridColumn: '1 / span 2' }}>
            <label style={labelStyle}><MapPin size={14} /> Residential Address</label>
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Street, City" style={inputStyle} required />
          </div>

          {/* Medical History */}
          <div style={{ ...inputGroup, gridColumn: '1 / span 2' }}>
            <label style={labelStyle}><ClipboardList size={14} /> Initial Medical Notes</label>
            <textarea 
              name="medicalHistory" 
              value={formData.medicalHistory} 
              onChange={handleChange} 
              placeholder="Allergies, chronic conditions, etc." 
              style={{ ...inputStyle, height: '80px', paddingTop: '10px', resize: 'none' }} 
            />
          </div>

          <button type="submit" style={submitBtn}>Register Patient</button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { 
  padding: '110px 40px 40px 40px', // THE FIX: Added 110px padding for Navbar
  backgroundColor: '#f8fafc', 
  minHeight: '100vh', 
  display: 'flex', 
  justifyContent: 'center' 
};

const formCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '700px', height: 'fit-content' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', transition: '0.2s' };
const submitBtn = { gridColumn: '1 / span 2', padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s' };
const successMsg = { backgroundColor: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' };
const errorMsg = { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' };

export default RegisterPatient;