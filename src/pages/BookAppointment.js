import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';

const BookAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    status: 'Scheduled'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [patientsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/api/auth/users', { headers: { 'x-auth-token': token } })
      ]);
      setPatients(patientsRes.data);
      // Filter for Doctors (Case-insensitive)
      setDoctors(usersRes.data.filter(u => u.role?.toLowerCase() === 'doctor'));
    } catch (err) {
      console.error("Data fetch error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: { 'x-auth-token': token }
      });
      setMessage({ type: 'success', text: 'Appointment booked successfully!' });
      setFormData({ patientId: '', doctorId: '', date: '', time: '', status: 'Scheduled' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to book appointment' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <Calendar size={28} color="#3498db" />
            <h2 style={{ color: '#2c3e50', margin: 0 }}>Book Appointment</h2>
        </div>
        
        {message.text && (
          <div style={{ ...alertStyle, backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2' }}>
            {message.type === 'success' ? <CheckCircle size={18} color="#065f46" /> : <AlertCircle size={18} color="#991b1b" />}
            <span style={{ color: message.type === 'success' ? '#065f46' : '#991b1b', fontSize: '0.9rem', fontWeight: '600' }}>
              {message.text}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}><User size={14} /> Select Patient</label>
            <select 
              style={inputStyle} 
              required 
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            >
              <option value="">-- Choose Patient --</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.fullName}</option>)}
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><UserCheck size={14} /> Assign Doctor</label>
            <select 
              style={inputStyle} 
              required 
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>
                  Dr. {d.fullName || d.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ ...inputGroup, flex: 1 }}>
              <label style={labelStyle}><Calendar size={14} /> Date</label>
              <input type="date" style={inputStyle} required value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div style={{ ...inputGroup, flex: 1 }}>
              <label style={labelStyle}><Clock size={14} /> Time</label>
              <input type="time" style={inputStyle} required value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={submitBtn}>
            {loading ? 'Processing...' : 'Schedule Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '110px 20px 40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center' };
const formCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' };
const inputGroup = { marginBottom: '20px' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px', transition: '0.2s' };
const alertStyle = { padding: '12px 15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #00000010' };

export default BookAppointment;