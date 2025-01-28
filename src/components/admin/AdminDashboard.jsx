// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Inbox, PlusCircle, UserCheck, MessageSquare } from 'lucide-react';
import { MessageInbox } from '../messages/MessageInbox';
import { CampaignManagement } from './CampaignManagement';
import { authService } from '../../services/api';
import { ApprovalRequests } from './ApprovalRequests';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inbox');
    const { user } = useSelector(state => state.auth);
    const [pendingApprovals, setPendingApprovals] = useState([]);
  
    useEffect(() => {
      fetchPendingApprovals();
    }, []);
  
    // const fetchPendingApprovals = async () => {
    //   try {
    //     const response = await authService.getPendingRequests();
    //     setPendingApprovals(response.data || []);  // Add a fallback empty array
    //   } catch (error) {
    //     console.error('Error fetching pending approvals:', error);
    //     toast.error('Failed to fetch pending approvals');
    //     setPendingApprovals([]);  // Set empty array on error
    //   }
    // };

    const fetchPendingApprovals = async () => {
      try {
        console.log('Fetching pending approvals...');
        const response = await authService.getPendingRequests();
        console.log('Pending approvals response:', response);
        console.log("Response data", response.data);
        if (response) {
          console.log('new',response.registration_requests);
          setPendingApprovals(response.registration_requests || []);
          console.log('Setting pending approvals:', response.registration_requests);
        } else {
          console.log('No pending approvals data received');
          setPendingApprovals([]);
        }
      } catch (error) {
        toast.error('Failed to fetch pending approvals');
        setPendingApprovals([]);
      }
    };
  
    return (
      <div className="min-h-screen">
        {/* Tab Navigation */}
        <div className="bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center px-4 py-2 space-x-2 border-b-2 ${
                  activeTab === 'inbox' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Inbox</span>
              </button>
              
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`flex items-center px-4 py-2 space-x-2 border-b-2 ${
                  activeTab === 'campaigns' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Campaign Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab('approvals')}
                className={`flex items-center px-4 py-2 space-x-2 border-b-2 ${
                  activeTab === 'approvals' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span>Approval Requests</span>
                {pendingApprovals.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
  
        {/* Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'inbox' && <MessageInbox />}
          {activeTab === 'campaigns' && <CampaignManagement />}
          {activeTab === 'approvals' && (
            <ApprovalRequests 
              pendingApprovals={pendingApprovals}
              onApprovalComplete={fetchPendingApprovals}
            />
          )}
        </div>
      </div>
    );
  };