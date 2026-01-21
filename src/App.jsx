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

// Placeholder pages for now
const PlaceHolder = ({ title }) => <div className="p-4 text-2xl font-bold text-gray-400">Work in Progress: {title}</div>;

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="actions" element={<Actions />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="templates" element={<Templates />} />
          <Route path="leads" element={<Leads />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
