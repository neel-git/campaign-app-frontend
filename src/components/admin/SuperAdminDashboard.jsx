// src/components/admin/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Users, Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

import CampaignForm from './CampaignForm';
import UserApprovalList from './UserApprovalList';
import { campaignService } from '../../services/api';
import {
  setCampaigns, 
  setLoading, 
  deleteCampaign 
} from '../../store/slices/campaignSlice';
import { setPractices } from '../../store/slices/practiceSlice';

// Dummy to test
const DUMMY_CAMPAIGNS = [
    {
      id: 1,
      name: "Welcome Newsletter",
      content: "Welcome to our practice management system!",
      description: "Initial welcome message for new users",
      type: "DEFAULT",
      status: "COMPLETED",
      created_at: "2025-01-15T10:00:00Z",
      delivery_type: "IMMEDIATE"
    },
    {
      id: 2,
      name: "Monthly Update - January",
      content: "Here are the updates for January...",
      description: "Monthly newsletter for January",
      type: "DEFAULT",
      status: "SCHEDULED",
      created_at: "2025-01-20T15:30:00Z",
      delivery_type: "SCHEDULED",
      scheduled_for: "2025-02-01T09:00:00Z"
    },
    {
      id: 3,
      name: "Urgent System Maintenance",
      content: "System will be down for maintenance...",
      description: "Emergency maintenance notification",
      type: "DEFAULT",
      status: "DRAFT",
      created_at: "2025-01-21T08:00:00Z",
      delivery_type: "IMMEDIATE"
    }
  ];
  
  const DUMMY_PENDING_USERS = [
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@example.com",
      requested_practice: "City Medical Center",
      requested_practice_id: 1,
      role: "practice_user",
      requested_at: "2025-01-20T14:30:00Z"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      requested_practice: "Downtown Clinic",
      requested_practice_id: 2,
      role: "admin",
      requested_at: "2025-01-21T09:15:00Z"
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      email: "m.chen@example.com",
      requested_practice: "Health First Practice",
      requested_practice_id: 3,
      role: "practice_user",
      requested_at: "2025-01-21T11:45:00Z"
    }
  ];
  
  // Add dummy practices for campaign form testing
  const DUMMY_PRACTICES = [
    {
      id: 1,
      name: "City Medical Center",
      description: "Main city hospital branch",
      is_active: true
    },
    {
      id: 2,
      name: "Downtown Clinic",
      description: "Downtown family practice",
      is_active: true
    },
    {
      id: 3,
      name: "Health First Practice",
      description: "Specialized health clinic",
      is_active: true
    },
    {
      id: 4,
      name: "West Side Medical",
      description: "Community health center",
      is_active: true
    }
  ];

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const { campaigns, isLoading } = useSelector((state) => state.campaigns);
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);

//   useEffect(() => {
//     fetchCampaigns();
//     fetchPendingUsers();
//   }, []);
  
useEffect(() => {
    // Simulating API calls with dummy data
    // Later, replace these with actual API calls
    dispatch(setCampaigns(DUMMY_CAMPAIGNS));
    setPendingUsers(DUMMY_PENDING_USERS);
    dispatch(setPractices(DUMMY_PRACTICES)); // Add this action to practiceSlice if not exists
  }, [dispatch]);

  const fetchCampaigns = async () => {
    try {
      dispatch(setLoading());
      const data = await campaignService.getCampaigns();
      dispatch(setCampaigns(data));
    } catch (error) {
      toast.error('Failed to fetch campaigns');
    }
  };

  const fetchPendingUsers = async () => {
    try {
      // This endpoint needs to be implemented in your backend
      const response = await campaignService.getPendingUsers();
      setPendingUsers(response);
    } catch (error) {
      toast.error('Failed to fetch pending users');
    }
  };

  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      await campaignService.deleteCampaign(selectedCampaign.id);
      dispatch(deleteCampaign(selectedCampaign.id));
      toast.success('Campaign deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedCampaign(null);
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Stats Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Campaigns</p>
                <h3 className="text-2xl font-bold text-purple-600">{campaigns.length}</h3>
              </div>
              <MessageCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Scheduled</p>
                <h3 className="text-2xl font-bold text-blue-600">
                  {campaigns.filter(c => c.status === 'SCHEDULED').length}
                </h3>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Approvals</p>
                <h3 className="text-2xl font-bold text-amber-600">{pendingUsers.length}</h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <h3 className="text-2xl font-bold text-emerald-600">-</h3>
              </div>
              <Users className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Campaigns</h2>
              <button
                onClick={() => setShowNewCampaignForm(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Campaign
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading campaigns...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No campaigns yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Type</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Created</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">{campaign.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            {campaign.type}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowNewCampaignForm(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-sm text-red-600 hover:text-red-800"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* User Approvals Section */}
        <div className="lg:col-span-1">
          <UserApprovalList 
            pendingUsers={pendingUsers}
            onUserActionComplete={fetchPendingUsers}
          />
        </div>
      </div>

      {/* Campaign Form Modal */}
      <CampaignForm 
        isOpen={showNewCampaignForm}
        onClose={() => {
          setShowNewCampaignForm(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Delete Campaign
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleDeleteCampaign}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default SuperAdminDashboard;