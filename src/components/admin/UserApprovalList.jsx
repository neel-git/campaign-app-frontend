// src/components/admin/UserApprovalList.jsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { campaignService } from '../../services/api';
import toast from 'react-hot-toast';

const UserApprovalList = ({ pendingUsers, onUserActionComplete }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (user) => {
    setIsProcessing(true);
    try {
      const requestType = user.current_role ? 'role_change' : 'registration';
      await authService.approveRequest(user.id, requestType);
      toast.success(`Approved ${user.full_name}'s ${requestType} request`);
      onUserActionComplete();
    } catch (error) {
      toast.error(error.message || 'Failed to approve user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectReason.trim()) return;

    setIsProcessing(true);
    try {
      const requestType = selectedUser.current_role ? 'role_change' : 'registration';
      await authService.rejectRequest(selectedUser.id, requestType, rejectReason);
      toast.success(`Rejected ${selectedUser.full_name}'s ${requestType} request`);
      setShowRejectDialog(false);
      setSelectedUser(null);
      setRejectReason('');
      onUserActionComplete();
    } catch (error) {
      toast.error(error.message || 'Failed to reject user');
    } finally {
      setIsProcessing(false);
    }
  }

  const renderRequestType = (user) => {
    const type = user.current_role ? 'Role Change' : 'Registration';
    const colorClass = user.current_role ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Pending Approvals</h2>
      
      {pendingUsers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500">Requested Practice:</span>
                    <span className="ml-1 text-xs font-medium text-gray-900">
                      {user.requested_practice}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(user)}
                    disabled={isProcessing}
                    className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRejectDialog(true);
                    }}
                    disabled={isProcessing}
                    className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={showRejectDialog}
        onClose={() => {
          if (!isProcessing) {
            setShowRejectDialog(false);
            setSelectedUser(null);
            setRejectReason('');
          }
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Reject User Registration
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Please provide a reason for rejection"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isProcessing) {
                      setShowRejectDialog(false);
                      setSelectedUser(null);
                      setRejectReason('');
                    }
                  }}
                  disabled={isProcessing}
                  className="px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing || !rejectReason.trim()}
                  className="px-3 py-1.5 text-white bg-red-600 hover:bg-red-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserApprovalList;