import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page Imports
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Don't forget this!
import AppointmentManager from './pages/AppointmentManager'; // And this!
import RegisterPatient from './pages/RegisterPatient';
import PatientRecords from './pages/PatientRecords';
import BookAppointment from './pages/BookAppointment'; 
import PatientDetails from './pages/PatientDetails';
import Billing from './pages/Billing';

// Component Imports
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar stays outside Routes so it shows on every page */}
        
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Admin & Staff Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment-manager" element={<AppointmentManager />} />
          <Route path="/billing" element={<Billing />} />

          {/* Patient Management Routes */}
          <Route path="/register-patient" element={<RegisterPatient />} />
          <Route path="/records" element={<PatientRecords />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;