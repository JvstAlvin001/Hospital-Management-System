import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({ diagnosis: '', treatment: '', doctorName: '' });

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    const res = await axios.get(`http://localhost:5000/api/patients/${id}`);
    setPatient(res.data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/patients/${id}/record`, formData);
      alert("Record Added!");
      setFormData({ diagnosis: '', treatment: '', doctorName: '' }); // Clear form
      fetchPatient(); // Refresh the list
    } catch (err) {
      console.error("Error saving record");
    }
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>{patient.fullName}'s Medical File</h1>
      
      {/* --- DIAGNOSIS FORM --- */}
      <form onSubmit={onSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Add New Clinical Note</h3>
        <input type="text" placeholder="Doctor Name" value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} required style={inputStyle} /><br/>
        <input type="text" placeholder="Diagnosis" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} required style={inputStyle} /><br/>
        <textarea placeholder="Treatment Plan" value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} style={inputStyle} /><br/>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Record</button>
      </form>

      <hr />
      <h3>Past Visits</h3>
      {patient.medicalHistory.map((rec, i) => (
        <div key={i} style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
          <p><strong>{new Date(rec.date).toLocaleDateString()}</strong> - {rec.diagnosis}</p>
          <p><small>Treatment: {rec.treatment} | Dr. {rec.doctorName}</small></p>
        </div>
      ))}
    </div>
  );
};

const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' };

export default PatientDetails;