import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UIProvider } from './components/providers/UIProvider';
import { DemoModal, VideoModal } from './components/Modals';
import { ThemeProvider } from './lib/ThemeProvider';

// Pages
import AdminLanding from './pages/admin/AdminLanding';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import OfficerLayout from './pages/officer/OfficerLayout';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import ApplicationsList from './pages/officer/ApplicationsList';
import ApplicationDetail from './pages/officer/ApplicationDetail';
import DataConflicts from './pages/officer/DataConflicts';
import CitizenLayout from './pages/citizen/CitizenLayout';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ServiceDiscovery from './pages/citizen/ServiceDiscovery';
import ApplicationFlow from './pages/citizen/ApplicationFlow';
import CitizenApplications from './pages/citizen/CitizenApplications';
import CitizenApplicationDetail from './pages/citizen/CitizenApplicationDetail';
import PermissionsAndHistory from './pages/citizen/PermissionsAndHistory';
import CitizenSupport from './pages/citizen/CitizenSupport';

export default function App() {
  return (
    <ThemeProvider>
      <UIProvider>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<AdminLanding />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Officer Routes */}
        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<OfficerDashboard />} />
          <Route path="applications" element={<ApplicationsList />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="tasks" element={<ApplicationsList />} />
          <Route path="conflicts" element={<DataConflicts />} />
        </Route>
        
        {/* Citizen Routes */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="services" element={<ServiceDiscovery />} />
          <Route path="apply/:serviceId" element={<ApplicationFlow />} />
          <Route path="applications" element={<CitizenApplications />} />
          <Route path="applications/:id" element={<CitizenApplicationDetail />} />
          <Route path="permissions" element={<PermissionsAndHistory />} />
          <Route path="history" element={<PermissionsAndHistory />} />
          <Route path="support" element={<CitizenSupport />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DemoModal />
      <VideoModal />
    </UIProvider>
    </ThemeProvider>
  );
}
