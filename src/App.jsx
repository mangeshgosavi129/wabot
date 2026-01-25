import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './protected/dashboard/page';
import Actions from './protected/actions/page';
import Inbox from './protected/inbox/page';
import Templates from './protected/templates/page';
import Leads from './protected/leads/page';
import Analytics from './protected/analytics/page';
import Settings from './protected/settings/page';
import Login from './auth/login/page';
import SignupCreateOrg from './auth/signup-create-org/page';
import SignupJoinOrg from './auth/signup-join-org/page';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './protected/users/page';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup/create-org" element={<SignupCreateOrg />} />
        <Route path="/signup/join-org" element={<SignupJoinOrg />} />

        {/* Protected Routes */}
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
