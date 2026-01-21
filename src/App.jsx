import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Actions from './pages/Actions';
import Onboarding from './pages/Onboarding';
import Inbox from './pages/Inbox';
import Templates from './pages/Templates';
import Leads from './pages/Leads';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SignupCreateOrg from './pages/SignupCreateOrg';
import SignupJoinOrg from './pages/SignupJoinOrg';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './pages/Users';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup/create-org" element={<SignupCreateOrg />} />
        <Route path="/signup/join-org" element={<SignupJoinOrg />} />

        {/* Protected Routes */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="actions" element={<Actions />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="templates" element={<Templates />} />
          <Route path="leads" element={<Leads />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users/>}/>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
