import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Phone, MapPin, Calendar, Activity, ArrowLeft, Clipboard, UserRound } from 'lucide-react';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setPatient(res.data);
      } catch (err) {
        console.error("Error fetching patient details", err);
      }
    };
    fetchPatient();
  }, [id]);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    return Math.abs(new Date(Date.now() - birthDate.getTime()).getUTCFullYear() - 1970);
  };

  if (!patient) return <div style={loadingStyle}>Loading Patient File...</div>;

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backBtn}>
        <ArrowLeft size={18} /> Back to Records
      </button>

      <div style={profileHeader}>
        <div style={avatarCircle}>
          <User size={40} color="#3498db" />
        </div>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>{patient.fullName}</h1>
          <p style={{ color: '#7f8c8d', margin: '5px 0' }}>Patient ID: {id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div style={gridContainer}>
        {/* LEFT COLUMN: PERSONAL INFO */}
        <div style={cardStyle}>
          <h3 style={cardTitle}><UserRound size={18} color="#3498db" /> Personal Details</h3>
          <div style={infoRow}><Calendar size={16} /> <span><strong>Age:</strong> {calculateAge(patient.dob)}</span></div>
          <div style={infoRow}><Phone size={16} /> <span><strong>Contact:</strong> {patient.contact}</span></div>
          <div style={infoRow}><MapPin size={16} /> <span><strong>Address:</strong> {patient.address}</span></div>
        </div>

        {/* RIGHT COLUMN: MEDICAL HISTORY */}
        <div style={cardStyle}>
          <h3 style={cardTitle}><Activity size={18} color="#2ecc71" /> Medical History</h3>
          
          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
            patient.medicalHistory.map((record, index) => (
              <div key={index} style={historyBox}>
                <div style={historyHeader}>
                  <span style={diagnosisText}>{record.diagnosis}</span>
                  <span style={dateText}>{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <p style={detailText}><strong>Treatment:</strong> {record.treatment}</p>
                <p style={detailText}><strong>Doctor:</strong> {record.doctorName}</p>
                
                {record.prescriptions && record.prescriptions.length > 0 && (
                  <div style={prescriptionWrapper}>
                    <Clipboard size={14} /> 
                    <span style={{ fontSize: '0.8rem' }}>{record.prescriptions.join(', ')}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#95a5a6', textAlign: 'center' }}>No history recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' };
const loadingStyle = { padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '1.2rem' };
const backBtn = { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#3498db', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' };
const profileHeader = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const avatarCircle = { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#3498db15', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const gridContainer = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' };
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', alignSelf: 'start' };
const cardTitle = { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '15px', color: '#2c3e50' };
const infoRow = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: '#576574' };

// History Specific Styles
const historyBox = { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '15px' };
const historyHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' };
const diagnosisText = { fontWeight: 'bold', color: '#2c3e50', fontSize: '1rem' };
const dateText = { fontSize: '0.8rem', color: '#95a5a6' };
const detailText = { margin: '4px 0', fontSize: '0.9rem', color: '#475569' };
const prescriptionWrapper = { marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e67e22', backgroundColor: '#fff9f1', padding: '5px 10px', borderRadius: '5px' };

export default PatientProfile;