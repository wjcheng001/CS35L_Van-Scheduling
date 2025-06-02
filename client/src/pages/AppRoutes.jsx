import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VanReservation, { ReservationSuccess } from './VanReserve';
import VanReturn, { ReturnSuccess } from './VanReturn';
import VanPickUp from './VanPickUp';
import Home from './Home';
import Dashboard from './DashboardScreen';
import Profile from './Profile';
import DriverApplication from './DriverApplication';
import Login from './Login';
import SearchPage from './SearchPage'; // Add this import

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/app" element={<DriverApplication />} />
        <Route path="/login" element={<Login />} />
        
        {/* Van reservation routes */}
        <Route path="/reserve" element={<VanReservation />} />
        <Route path="/reservation-success" element={<ReservationSuccess />} />
        
        {/* Van return routes */}
        <Route path="/return" element={<VanReturn />} />
        <Route path="/return-success" element={<ReturnSuccess />} />
        
        {/* Van pick-up route (if needed in the future) */}
        <Route path="/pickup" element={<VanPickUp />} />
        
        {/* Search route */}
        <Route path="/search" element={<SearchPage />} />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;