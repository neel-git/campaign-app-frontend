import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from "../layout/DashboardLayout";
import { AdminDashboard } from '../admin/AdminDashboard';

export const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "Admin") {
    if (user?.role === "Practice by Numbers Support") {
      return <Navigate to="/super-admin-dashboard" replace />;
    }
    return <Navigate to="/inbox" replace />;
  }

  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  );
};

export default AdminDashboardPage;