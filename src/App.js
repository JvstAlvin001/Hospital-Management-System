import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RegisterPatient from './pages/RegisterPatient';
import PatientRecords from './pages/PatientRecords';
import PatientProfile from './pages/PatientProfile'; 
import EditPatient from './pages/EditPatient';
import AppointmentManager from './pages/AppointmentManager';
import BookAppointment from './pages/BookAppointment';
import Billing from './pages/Billing';
import ProtectedRoute from './components/ProtectedRoute';
import AddStaff from './pages/AddStaff'; // Already imported, nice!

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      {/* Navbar only shows if user is logged in */}
      {isAuthenticated && <Navbar />}

      <div>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/register-patient" element={<ProtectedRoute><RegisterPatient /></ProtectedRoute>} />
          <Route path="/records" element={<ProtectedRoute><PatientRecords /></ProtectedRoute>} />
          
          <Route path="/edit-patient/:id" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} /> 
          <Route path="/patient/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          
          <Route path="/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointment-manager" element={<ProtectedRoute><AppointmentManager /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />

          {/* THE NEW ROUTE: Added the staff management page */}
          <Route path="/add-staff" element={<ProtectedRoute><AddStaff /></ProtectedRoute>} />

          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;