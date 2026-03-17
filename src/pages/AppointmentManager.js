import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/appointments/all', {
        headers: { 'x-auth-token': token }
      });
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/${newStatus}/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      fetchAppointments();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Calendar size={28} color="#3498db" />
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.8rem' }}>Appointment Manager</h1>
        </div>
      </header>

      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRow}>
                <th style={thStyle}>Patient Name</th>
                <th style={thStyle}>Doctor</th>
                <th style={thStyle}>Date & Time</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} style={rowStyle}>
                  <td style={tdStyle}>{appt.patientId?.fullName || 'N/A'}</td>
                  <td style={tdStyle}>Dr. {appt.doctorId?.name || 'Unassigned'}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '500' }}>{new Date(appt.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{appt.time}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={getStatusStyle(appt.status)}>{appt.status}</span>
                  </td>
                  <td style={tdStyle}>
                    {appt.status === 'Scheduled' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleStatusUpdate(appt._id, 'complete')}
                          style={completeBtn}
                        >
                          <CheckCircle size={14} /> Done
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(appt._id, 'cancel')}
                          style={cancelBtn}
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const containerStyle = { 
  padding: '110px 40px 40px 40px', 
  backgroundColor: '#f8fafc', 
  minHeight: '100vh' 
};

const headerStyle = { marginBottom: '30px' };
const tableContainer = { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const headerRow = { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const thStyle = { padding: '15px 20px', color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 20px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '0.95rem' };
const rowStyle = { transition: 'background 0.2s' };

const getStatusStyle = (status) => ({
  padding: '4px 12px',
  borderRadius: '20px', // Pill shape status
  fontSize: '0.75rem',
  fontWeight: '600',
  backgroundColor: status === 'Completed' ? '#ecfdf5' : status === 'Cancelled' ? '#fff1f2' : '#fffbeb',
  color: status === 'Completed' ? '#10b981' : status === 'Cancelled' ? '#e11d48' : '#d97706',
  border: `1px solid ${status === 'Completed' ? '#10b98133' : status === 'Cancelled' ? '#e11d4833' : '#d9770633'}`
});

// THE ROUNDED PILL BUTTON STYLES
const btnBase = { 
  border: '1px solid', 
  borderRadius: '20px', // FULLY ROUNDED
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '5px', 
  padding: '5px 14px', // Slightly wider for the pill look
  fontSize: '0.75rem', 
  fontWeight: '600',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease'
};

const completeBtn = { 
  ...btnBase, 
  borderColor: '#10b981', 
  color: '#10b981' 
};

const cancelBtn = { 
  ...btnBase, 
  borderColor: '#e11d48', 
  color: '#e11d48' 
};

export default AppointmentManager;