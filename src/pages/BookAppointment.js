import React, { useState } from 'react';
import axios from 'axios';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    patientId: '', // You would normally select this from a list
    doctorId: '',  // You would normally select this from a list
    date: '',
    time: ''
  });

const onSubmit = async e => {
  e.preventDefault();
  
  // 1. Check if the form actually has data BEFORE sending
  console.log("Form Data being sent:", formData);

  try {
    const res = await axios.post('http://localhost:5000/api/appointments/book', formData);
    
    // 2. Check what the server sent back
    console.log("Server Response:", res.data);
    alert(res.data.msg); 
  } catch (err) {
    // 3. Check what the error message actually is
    console.error("Error caught:", err.response.data);
    alert(err.response.data.msg);
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <h2>Schedule Appointment</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="patientId" placeholder="Patient ID" onChange={e => setFormData({...formData, patientId: e.target.value})} required /><br/>
        <input type="text" name="doctorId" placeholder="Doctor ID" onChange={e => setFormData({...formData, doctorId: e.target.value})} required /><br/>
        <input type="date" name="date" onChange={e => setFormData({...formData, date: e.target.value})} required /><br/>
        <input type="time" name="time" onChange={e => setFormData({...formData, time: e.target.value})} required /><br/>
        <button type="submit">Confirm Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointment;