import React, { useState } from 'react';
import axios from 'axios';

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    contact: '',
    address: ''
  });

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Sending data to the backend API we created earlier
      const res = await axios.post('http://localhost:5000/api/patients/register', formData);
      alert('Registration Successful! Patient ID: ' + res.data.patientId);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Registration failed'));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register New Patient</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Full Name:</label><br/>
          <input type="text" name="fullName" onChange={onChange} required />
        </div>
        <div>
          <label>Date of Birth:</label><br/>
          <input type="date" name="dob" onChange={onChange} required />
        </div>
        <div>
          <label>Gender:</label><br/>
          <select name="gender" onChange={onChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Contact Number:</label><br/>
          <input type="text" name="contact" onChange={onChange} required />
        </div>
        <div>
          <label>Address:</label><br/>
          <textarea name="address" onChange={onChange}></textarea>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Register Patient</button>
      </form>
    </div>
  );
};

export default RegisterPatient;