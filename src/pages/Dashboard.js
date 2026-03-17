import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, AlertCircle, UserPlus, CreditCard, ClipboardList } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Get role to hide buttons
  const [stats, setStats] = useState({ totalPatients: 0, pendingAppointments: 0, totalRevenue: 0, totalUnpaidAmount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/stats/summary', { headers: { 'x-auth-token': token } });
        setStats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div style={containerStyle}>
      <header style={{ marginBottom: '40px' }}>
        <h1>Hospital Command Center</h1>
        <p>Logged in as: <strong>{userRole}</strong></p>
      </header>

      <div style={gridStyle}>
        <StatCard title="Total Patients" value={stats.totalPatients} color="#3498db" Icon={Users} />
        <StatCard title="Upcoming Appointments" value={stats.pendingAppointments} color="#f1c40f" Icon={Calendar} />
        {userRole === 'Admin' && <StatCard title="Revenue" value={`KES ${stats.totalRevenue}`} color="#2ecc71" Icon={DollarSign} />}
      </div>

      <div style={{ marginTop: '50px', backgroundColor: 'white', padding: '30px', borderRadius: '15px' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          {userRole === 'Admin' && (
            <button style={blueBtn} onClick={() => navigate('/register-patient')}>
              <UserPlus size={18} /> Register Patient
            </button>
          )}

          <button style={purpleBtn} onClick={() => navigate('/book-appointment')}>
            <Calendar size={18} /> Book Appointment
          </button>

          {userRole === 'Admin' && (
            <button style={greenBtn} onClick={() => navigate('/billing')}>
              <CreditCard size={18} /> Process Payments
            </button>
          )}

          <button style={darkBtn} onClick={() => navigate('/appointment-manager')}>
            <ClipboardList size={18} /> View Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, Icon }) => (
  <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flex: 1, display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `6px solid ${color}` }}>
    <Icon color={color} size={30} />
    <div><p style={{ margin: 0, color: '#95a5a6', fontSize: '0.8rem' }}>{title}</p><h2 style={{ margin: 0 }}>{value}</h2></div>
  </div>
);

const containerStyle = { padding: '100px 40px', backgroundColor: '#f8fafc', minHeight: '100vh' };
const gridStyle = { display: 'flex', gap: '25px' };
const btnBase = { padding: '12px 20px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' };
const blueBtn = { ...btnBase, backgroundColor: '#3498db' };
const purpleBtn = { ...btnBase, backgroundColor: '#9b59b6' };
const greenBtn = { ...btnBase, backgroundColor: '#2ecc71' };
const darkBtn = { ...btnBase, backgroundColor: '#2c3e50' };

export default Dashboard;