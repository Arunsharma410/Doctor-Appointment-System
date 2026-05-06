import React from 'react';
import AdminDashboard from './pages/admin/Dashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAppointments from './pages/admin/ManageAppointments';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorDetails from './pages/DoctorDetails';
import DoctorAvailability from './pages/doctor/Availability';
import PatientDashboard from './pages/patient/Dashboard';
import MyAppointments from './pages/patient/MyAppointments';
import PatientProfile from './pages/patient/Profile';
import DoctorProfile from './pages/doctor/DoctorProfile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
// Layout
import Layout from './components/common/Layout';

// Pages
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Routes
// Protected Routes
import {
  AdminRoute,
  DoctorRoute,
  PatientRoute,
} from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/doctors"
            element={
              <Layout>
                <Doctors />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

{/* Patient Routes */}
<Route
  path="/patient/dashboard"
  element={
    <PatientRoute>
      <PatientDashboard />
    </PatientRoute>
  }
/>
<Route
  path="/patient/appointments"
  element={
    <PatientRoute>
      <MyAppointments />
    </PatientRoute>
  }
/>
<Route
  path="/patient/profile"
  element={
    <PatientRoute>
      <PatientProfile />
    </PatientRoute>
  }
/>

  {/* Doctor Routes */}
<Route
  path="/doctor/dashboard"
  element={
    <DoctorRoute>
      <DoctorDashboard />
    </DoctorRoute>
  }
/>
<Route
  path="/doctor/appointments"
  element={
    <DoctorRoute>
      <DoctorAppointments />
    </DoctorRoute>
  }
/>
<Route
  path="/doctor/availability"
  element={
    <DoctorRoute>
      <DoctorAvailability />
    </DoctorRoute>
  }
/>
{/* Doctor Details Route */}
<Route
  path="/doctors/:id"
  element={
    <Layout>
      <DoctorDetails />
    </Layout>
  }
/>
{/* Admin Routes */}
<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/admin/doctors"
  element={
    <AdminRoute>
      <ManageDoctors />
    </AdminRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <ManageUsers />
    </AdminRoute>
  }
/>
<Route
  path="/admin/appointments"
  element={
    <AdminRoute>
      <ManageAppointments />
    </AdminRoute>
  }
/>
      
{/* Doctor Profile Route */}
<Route
  path="/doctors/:id"
  element={
    <Layout>
      <DoctorProfile />
    </Layout>
  }
/>

{/* 404 Page */}
<Route
  path="*"
  element={
    <Layout>
      <NotFound />
    </Layout>
  }
/>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;