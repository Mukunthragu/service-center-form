import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import ServiceCenterSubscriptionForm from './ServiceCenterSubscriptionForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/homepage" />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/ServiceCenter" element={<ServiceCenterSubscriptionForm />} />
    </Routes>
  );
}

export default App;