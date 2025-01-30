// src/components/admin/ApprovalRequests.jsx
import React, { useState,useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { authService } from '../../services/api'
import toast from 'react-hot-toast';

export const ApprovalRequests = ({ pendingApprovals, onApprovalComplete, title}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isRoleChangeRequest = (request) => {
    return 'current_role' in request;
  };

  useEffect(() => {
    console.log('ApprovalRequests component mounted');
    console.log('Pending approvals:', pendingApprovals);
  }, [pendingApprovals]);

  const handleApprove = async (request) => {
    try {
      setIsProcessing(true);
      const requestType = isRoleChangeRequest(request) ? 'role_change' : 'registration';
      await authService.approveRequest(request.id, requestType);
      toast.success(`Approved ${request.user.full_name}'s request`);
      onApprovalComplete();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) return;

    try {
      setIsProcessing(true);
      const requestType = isRoleChangeRequest(selectedRequest) ? 'role_change' : 'registration';
      await authService.rejectRequest(selectedRequest.id, requestType, rejectReason);
      toast.success(`Rejected ${selectedRequest.user.full_name}'s request`);
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason('');
      onApprovalComplete();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-medium text-gray-900">{title}({pendingApprovals.length})</h2>
      
      {pendingApprovals.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No pending approval requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {request.user.full_name}
                  </h3>
                  <p className="text-sm text-gray-500">{request.user.email}</p>
                  <div className="mt-1 text-xs text-gray-500">
                    Requested Role: {request.requested_role}
                  </div>
                  {request.practice && (
                    <div className="text-xs text-gray-500">
                      Practice: {request.practice.name}
                    </div>
                  )}
                  {request.current_role && (
                    <div className="text-xs text-gray-500">
                      Current Role: {request.current_role}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Requested: {new Date(request.created_at || request.requested_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(request)}
                    disabled={isProcessing}
                    className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRejectDialog(true);
                    }}
                    disabled={isProcessing}
                    className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => {
          if (!isProcessing) {
            setShowRejectDialog(false);
            setSelectedRequest(null);
            setRejectReason('');
          }
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Reject Request
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason
                </label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows="3"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isProcessing) {
                      setShowRejectDialog(false);
                      setSelectedRequest(null);
                      setRejectReason('');
                    }
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing || !rejectReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Rejecting...' : 'Reject Request'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};