import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Calendar, DollarSign, AlertCircle, PlusCircle, CreditCard, ClipboardList } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patientCount: 0,
    appointmentCount: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stats/summary');
        setStats(res.data);
      } catch (err) {
        console.error("Error loading stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.2rem' }}>Hospital Command Center</h1>
        <p style={{ color: '#7f8c8d' }}>Real-time overview of Megalife operations</p>
      </header>

      {/* STATS GRID */}
      <div style={gridStyle}>
        <StatCard title="Total Patients" value={stats.patientCount} color="#3498db" Icon={Users} />
        <StatCard title="Pending Appointments" value={stats.appointmentCount} color="#f1c40f" Icon={Calendar} />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} color="#2ecc71" Icon={DollarSign} />
        <StatCard title="Unpaid Bills" value={`$${stats.pendingPayments}`} color="#e74c3c" Icon={AlertCircle} />
      </div>

      <div style={contentLayout}>
        <div style={sectionStyle}>
          <h3 style={{ marginBottom: '20px' }}>System Quick Actions</h3>
          <div style={buttonGroup}>
            <button style={actionBtn} onClick={() => window.location.href='/register-patient'}>
              <PlusCircle size={18} /> Register Patient
            </button>
            <button style={actionBtn} onClick={() => window.location.href='/billing'}>
              <CreditCard size={18} /> Process Payments
            </button>
            <button style={actionBtn} onClick={() => window.location.href='/appointment-manager'}>
              <ClipboardList size={18} /> View Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated reusable component using Lucide Icons
const StatCard = ({ title, value, color, Icon }) => (
  <div style={{ ...cardStyle, borderLeft: `6px solid ${color}` }}>
    <div style={{ backgroundColor: `${color}15`, padding: '15px', borderRadius: '12px' }}>
      <Icon color={color} size={32} />
    </div>
    <div>
      <h4 style={{ margin: '0', color: '#95a5a6', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h4>
      <h2 style={{ margin: '5px 0 0 0', fontSize: '1.8rem', color: '#2c3e50' }}>{value}</h2>
    </div>
  </div>
);

// --- STYLES ---
const containerStyle = { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' };
const headerStyle = { marginBottom: '40px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px' };
const contentLayout = { marginTop: '50px' };
const sectionStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const buttonGroup = { display: 'flex', gap: '20px', flexWrap: 'wrap' };
const actionBtn = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' };

export default Dashboard;