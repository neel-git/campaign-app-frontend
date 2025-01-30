import React, { useState, useEffect } from 'react';
import { ApprovalRequests } from './ApprovalRequests'
import { authService } from '../../services/api'
import toast from 'react-hot-toast';

export const ApprovalRequestsSection = () => {
  const [pendingRequests, setPendingRequests] = useState({
    registration_requests: [],
    role_change_requests: []
  });

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await authService.getPendingRequests();
      if (response) {
        setPendingRequests({
          registration_requests: response.registration_requests || [],
          role_change_requests: response.role_change_requests || []
        });
      }
    } catch (error) {
      toast.error('Failed to fetch pending requests');
      setPendingRequests({
        registration_requests: [],
        role_change_requests: []
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Approval Requests</h2>

      <ApprovalRequests
        pendingApprovals={pendingRequests.registration_requests}
        onApprovalComplete={fetchPendingRequests}
        title="Registration Requests"
      />

      <ApprovalRequests
        pendingApprovals={pendingRequests.role_change_requests}
        onApprovalComplete={fetchPendingRequests}
        title="Role Change Requests"
      />
    </div>
  );
};