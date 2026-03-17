import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setFormData({
          fullName: res.data.fullName,
          phoneNumber: res.data.phoneNumber || res.data.contact,
          address: res.data.address || '',
          gender: res.data.gender
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/patients/${id}`, formData, {
        headers: { 'x-auth-token': token }
      });
      alert('Patient updated successfully!');
      navigate('/records');
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div style={{ padding: '120px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate('/records')} style={backBtn}>
        <ArrowLeft size={18} /> Back
      </button>

      <div style={formCard}>
        <h2 style={{ marginBottom: '25px', color: '#2c3e50' }}>Edit Patient Details</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Full Name</label>
            <input 
              style={inputStyle}
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Phone Number</label>
            <input 
              style={inputStyle}
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Address</label>
            <textarea 
              style={{ ...inputStyle, height: '80px', resize: 'none' }}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <button type="submit" style={saveBtn}>
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '110px 40px 40px 40px', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const backBtn = { alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#3498db', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' };
const formCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' };
const inputGroup = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' };
const saveBtn = { width: '100%', backgroundColor: '#3498db', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' };

export default EditPatient;