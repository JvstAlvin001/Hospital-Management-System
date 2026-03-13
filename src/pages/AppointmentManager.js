import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, User, Stethoscope, Search } from 'lucide-react';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/appointments/all', {
          headers: { 'x-auth-token': token }
        });
        
        console.log("SERVER DATA:", res.data);
        setAppointments(res.data);
      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err.message);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={iconBoxStyle}><Clock color="#3498db" size={24} /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>Appointment Schedule</h1>
            <p style={{ margin: 0, color: '#7f8c8d' }}>Manage and track patient visits</p>
          </div>
        </div>
      </header>

      <div style={searchBarArea}>
        <div style={searchWrapper}>
          <Search size={18} color="#95a5a6" />
          <input 
            type="text" 
            placeholder="Search by patient name..." 
            style={searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeader}>
              <th style={{ padding: '15px' }}>Patient</th>
              <th>Reason</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments
                .filter(app => {
                  const name = app.patientId?.fullName || "";
                  return name.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .map((app) => (
                  <tr key={app._id} style={tableRow}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={16} color="#34495e" />
                        <strong>{app.patientId?.fullName || "Name Missing"}</strong>
                      </div>
                    </td>
                    <td>{app.reason}</td>
                    <td>{app.date ? new Date(app.date).toLocaleDateString() : 'N/A'} at {app.time}</td>
                    <td>
                      <span style={app.status === 'Scheduled' ? statusPending : statusPaid}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                  No appointments found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ); 
};

// --- STYLES SECTION ---
const containerStyle = { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' };
const headerStyle = { marginBottom: '30px' };
const iconBoxStyle = { backgroundColor: '#3498db20', padding: '12px', borderRadius: '10px' };
const searchBarArea = { marginBottom: '20px' };
const searchWrapper = { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' };
const searchInput = { border: 'none', outline: 'none', width: '100%' };
const tableContainer = { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { backgroundColor: '#f1f5f9', textAlign: 'left', color: '#64748b' };
const tableRow = { borderBottom: '1px solid #f1f5f9' };

// Fixed missing styles:
const statusPending = { 
  backgroundColor: '#fef3c7', 
  color: '#d97706', 
  padding: '4px 12px', 
  borderRadius: '20px', 
  fontSize: '0.85rem',
  fontWeight: 'bold'
};

const statusPaid = { 
  backgroundColor: '#d1fae5', 
  color: '#059669', 
  padding: '4px 12px', 
  borderRadius: '20px', 
  fontSize: '0.85rem',
  fontWeight: 'bold'
};

export default AppointmentManager;