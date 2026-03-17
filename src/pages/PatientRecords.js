import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Database, Search, User, Phone, Eye, Edit, Calendar } from 'lucide-react';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/patients', {
        headers: { 'x-auth-token': token }
      });
      setPatients(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setLoading(false);
    }
  };

  // --- AGE CALCULATION HELPER ---
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const filteredPatients = patients.filter(p => 
    (p.fullName && p.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.phoneNumber && p.phoneNumber.includes(searchTerm)) ||
    (p.contact && p.contact.includes(searchTerm)) // Check both naming versions
  );

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Database size={28} color="#3498db" />
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.8rem' }}>Patient Records</h1>
        </div>
        
        <div style={searchWrapper}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search name or phone..." 
            style={searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <p style={{ padding: '20px' }}>Loading database...</p>
      ) : (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRow}>
                <th style={thStyle}>Full Name</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Age / Gender</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient._id} style={rowStyle}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{patient.fullName}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                      <Phone size={14} /> 
                      {/* Check both phoneNumber and contact fields */}
                      {patient.phoneNumber || patient.contact || 'No Contact'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#475569' }}>
                      {calculateAge(patient.dob)} yrs • {patient.gender}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => navigate(`/patient/${patient._id}`)} style={viewBtn}>
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => navigate(`/edit-patient/${patient._id}`)} style={editBtn}>
                        <Edit size={14} /> Edit
                      </button>
                    </div>
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
const containerStyle = { padding: '110px 40px 40px 40px', backgroundColor: '#f8fafc', minHeight: '100vh' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const searchWrapper = { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '8px 18px', borderRadius: '25px', border: '1px solid #e2e8f0', width: '320px' };
const searchInput = { border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' };
const tableContainer = { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const headerRow = { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const thStyle = { padding: '18px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' };
const rowStyle = { transition: 'background 0.2s' };

const btnBase = { border: '1px solid', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'transparent', transition: 'all 0.2s' };
const viewBtn = { ...btnBase, borderColor: '#3498db', color: '#3498db' };
const editBtn = { ...btnBase, borderColor: '#94a3b8', color: '#64748b' };

export default PatientRecords;