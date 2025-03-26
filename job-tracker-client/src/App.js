import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateJob from './pages/CreateJob';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import EditJob from './pages/EditJob';
import ScheduleInterview from './pages/ScheduleInterview';
import ViewScheduledInterviews from './pages/ViewScheduledInterviews';
import EditInterview from './pages/EditInterview';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
      <AuthProvider>
          <Router>
              <Navbar />
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/create-job" element={<PrivateRoute><CreateJob /></PrivateRoute>} />
                  <Route path="/jobs/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
                  <Route path="/jobs/:id/edit" element={<PrivateRoute><EditJob /></PrivateRoute>} />
                  <Route path="/schedule-interview/:id" element={<PrivateRoute><ScheduleInterview /></PrivateRoute>} />
                  <Route path="/view-scheduled-interviews" element={<PrivateRoute><ViewScheduledInterviews /></PrivateRoute>} />
                  <Route path="/edit-interview/:id" element={<PrivateRoute><EditInterview /></PrivateRoute>} />
              </Routes>
          </Router>
      </AuthProvider>
  );
}

export default App;
