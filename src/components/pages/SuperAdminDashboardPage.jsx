// src/pages/SuperAdminDashboardPage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from "../layout/DashboardLayout"
import SuperAdminDashboard from "../admin/SuperAdminDashboard"

export const SuperAdminDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if not authenticated or not a super admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'UserRoleType.super_admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <SuperAdminDashboard />
    </DashboardLayout>
  );
};

// export default SuperAdminDashboardPage;