import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/patients/all');
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients");
      }
    };
    fetchPatients();
  }, []);

  // Filter the list based on the search term
  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Hospital Patient Records</h2>

      {/* Search Input Bar */}
      <input 
        type="text" 
        placeholder="Search by Name or Phone..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Full Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient._id}>
              <td>{patient.fullName}</td>
              <td>{new Date(patient.dob).toLocaleDateString()}</td>
              <td>{patient.gender}</td>
              <td>{patient.contact}</td>
              <td><button><td>
  <a href={`/patient/${patient._id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
    View Full File
  </a>
</td></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const cellStyle = { padding: '12px', borderBottom: '1px solid #eee' };

export default PatientRecords;