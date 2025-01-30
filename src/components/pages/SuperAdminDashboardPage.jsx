// src/pages/SuperAdminDashboardPage.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from "../layout/DashboardLayout";
import { SuperAdminDashboard } from "../admin/SuperAdminDashboard";
import { PracticeManagementPage } from './PracticeManagementPage';
import { Clipboard, Building2, Users } from 'lucide-react';
import { ApprovalRequestsSection } from '../admin/ApprovalRequestSection';

export const SuperAdminDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('campaigns');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "Practice by Numbers Support") {
    return <Navigate to="/inbox" replace />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`flex items-center px-4 py-4 space-x-2 border-b-2 ${
                  activeTab === 'campaigns'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Clipboard className="w-5 h-5" />
                <span>Campaign Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab('practices')}
                className={`flex items-center px-4 py-4 space-x-2 border-b-2 ${
                  activeTab === 'practices'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>Practice Management</span>
              </button>

              <button
                onClick={() => setActiveTab('approvals')}
                className={`flex items-center px-4 py-4 space-x-2 border-b-2 ${
                  activeTab === 'approvals'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Approval Requests</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'campaigns' && <SuperAdminDashboard />}
          {activeTab === 'practices' && <PracticeManagementPage />}
          {activeTab === 'approvals' && <ApprovalRequestsSection />}
        </div>
      </div>
    </DashboardLayout>
  );
};