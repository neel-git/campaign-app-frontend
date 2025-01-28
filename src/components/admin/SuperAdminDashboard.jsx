import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Edit, Trash, History, Send } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { CampaignForm } from './CampaignForm';
import { practiceService } from '../../services/api'; 
import { setPractices } from '../../store/slices/practiceSlice'; 
import { campaignService } from '../../services/api';
import toast from 'react-hot-toast';
import { setCampaigns, deleteCampaign, updateCampaign,updateCampaignStatus } from '../../store/slices/campaignSlice';
import { motion } from 'framer-motion';

export const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const { campaigns } = useSelector(state => state.campaigns);
  const { user } = useSelector(state => state.auth);
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching campaigns and practices...');
      
      const [campaignResponse, practicesResponse] = await Promise.all([
        campaignService.getCampaigns(),
        practiceService.getPractices()
      ]);

      console.log('Campaign Response:', campaignResponse);
      console.log('Practices Response:', practicesResponse);
      if (campaignResponse && campaignResponse.data) {
        
        console.log('Campaign data:', campaignResponse.data);
        dispatch(setCampaigns(campaignResponse.data));
      } else {
        console.log('No data in response:', campaignResponse);
        dispatch(setCampaigns([]));
      }
      if (practicesResponse) {
        console.log('Practices data:', practicesResponse);
        dispatch(setPractices(practicesResponse));
      }
  
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data
      });
      toast.error('Failed to fetch data');
      dispatch(setCampaigns([]));
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchCampaigns = async () => {
  //   try {
  //     setIsLoading(true);
  //     console.log('Fetching campaigns...');
      
  //     const response = await campaignService.getCampaigns();
  //     console.log('Raw API response:', response);
      
  //     if (response && response.data) {
  //       console.log('Campaign data:', response.data);
  //       dispatch(setCampaigns(response.data));
  //     } else {
  //       console.log('No data in response:', response);
  //       dispatch(setCampaigns([]));
  //     }
  //   } catch (error) {
  //     console.error('Error details:', {
  //       message: error.message,
  //       response: error.response,
  //       data: error.response?.data
  //     });
  //     toast.error('Failed to fetch campaigns');
  //     dispatch(setCampaigns([]));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDelete = async (campaignId) => {
    try {
      await campaignService.deleteCampaign(campaignId);
      dispatch(deleteCampaign(campaignId));
      toast.success('Campaign deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedCampaign(null);
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const handleCampaignSend = async (campaignId) => {
    try {
      dispatch(updateCampaignStatus({ id: campaignId, status: 'IN_PROGRESS' }));
      await campaignService.sendCampaign(campaignId);
      toast.success('Campaign sent successfully');
      await fetchCampaigns(); // Refresh to update status
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send campaign');
      dispatch(updateCampaignStatus({ id: campaignId, status: 'FAILED' }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage all communication campaigns
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedCampaign(null);
              setShowNewCampaignForm(true);
            }}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Campaign
          </motion.button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No campaigns yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first campaign
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        campaign.campaign_type === 'DEFAULT' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {campaign.campaign_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-3">
                        {campaign.status === 'DRAFT' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowNewCampaignForm(true);
                              }}
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>
                            {campaign.delivery_type === 'IMMEDIATE' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handleCampaignSend(campaign.id)}
                                title="Send"
                              >
                                <Send className="w-5 h-5" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowDeleteConfirm(true);
                              }}
                              title="Delete"
                            >
                              <Trash className="w-5 h-5" />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowHistory(true);
                          }}
                          title="History"
                        >
                          <History className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Campaign Form Modal */}
      <CampaignForm
        isOpen={showNewCampaignForm}
        onClose={() => {
          setShowNewCampaignForm(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
        onSuccess={fetchCampaigns}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900">Delete Campaign</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedCampaign.id)}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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

// src/components/admin/SuperAdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { PlusCircle, Users, Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
// import { Dialog } from '@headlessui/react';
// import toast from 'react-hot-toast';

// import {CampaignForm} from './CampaignForm';
// import UserApprovalList from './UserApprovalList';
// import { authService } from '../../services/api';
// import {
//   setCampaigns, 
//   setLoading, 
//   deleteCampaign,
//   setError
// } from '../../store/slices/campaignSlice';
// import { setPractices } from '../../store/slices/practiceSlice';

// const SuperAdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { campaigns, isLoading } = useSelector((state) => state.campaigns);
//   const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [pendingRequests, setPendingRequests] = useState({
//     registration_requests: [],
//     role_change_requests: []
//   });

//   useEffect(() => {
//     fetchInitialData();
//   }, [dispatch]);
  
//   const fetchInitialData = async () => {
//     try {
//       dispatch(setLoading(true)); // Dispatch the loading action

//       const [campaignData, requestsData] = await Promise.all([
//         campaignService.getCampaigns(),
//         authService.getPendingRequests()
//       ]);
      
//       const allRequests = {
//         registration_requests: requestsData.registration_requests || [],
//         role_change_requests: requestsData.role_change_requests || []
//       };
      
//       dispatch(setCampaigns(campaignData));
//       setPendingRequests(allRequests);
//     } catch (error) {
//       toast.error('Failed to fetch dashboard data');
//       dispatch(setError(error.message));
//     }
//   };

//   const handleRequestComplete = async () => {
//     try {
//       const requests = await authService.getPendingRequests();
//       setPendingRequests(requests);
//       toast.success('Requests updated successfully');
//     } catch (error) {
//       toast.error('Failed to refresh requests');
//     }
//   };

//   const handleDeleteCampaign = async () => {
//     if (!selectedCampaign) return;

//     try {
//       await campaignService.deleteCampaign(selectedCampaign.id);
//       dispatch(deleteCampaign(selectedCampaign.id));
//       toast.success('Campaign deleted successfully');
//       setShowDeleteConfirm(false);
//       setSelectedCampaign(null);
//     } catch (error) {
//       toast.error('Failed to delete campaign');
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'DRAFT':
//         return 'bg-gray-100 text-gray-800';
//       case 'SCHEDULED':
//         return 'bg-blue-100 text-blue-800';
//       case 'IN_PROGRESS':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'COMPLETED':
//         return 'bg-green-100 text-green-800';
//       case 'FAILED':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
//       {/* Stats Section */}
//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Campaigns</p>
//                 <h3 className="text-2xl font-bold text-purple-600">{campaigns.length}</h3>
//               </div>
//               <MessageCircle className="w-8 h-8 text-purple-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Scheduled</p>
//                 <h3 className="text-2xl font-bold text-blue-600">
//                   {campaigns.filter(c => c.status === 'SCHEDULED').length}
//                 </h3>
//               </div>
//               <Calendar className="w-8 h-8 text-blue-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Pending Approvals</p>
//                 <h3 className="text-2xl font-bold text-amber-600">{pendingRequests.length}</h3>
//               </div>
//               <AlertTriangle className="w-8 h-8 text-amber-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Active Users</p>
//                 <h3 className="text-2xl font-bold text-emerald-600">-</h3>
//               </div>
//               <Users className="w-8 h-8 text-emerald-500" />
//             </div>
//           </div>
//         </div>
//       </div>

      
//        {/* Main Content */}
//       <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Campaigns Section */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800">Campaigns</h2>
//               <button
//                 onClick={() => setShowNewCampaignForm(true)}
//                 className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//               >
//                 <PlusCircle className="w-5 h-5 mr-2" />
//                 New Campaign
//               </button>
//             </div>

//             <div className="h-[400px] overflow-y-auto">
//               {isLoading ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">Loading campaigns...</p>
//                 </div>
//               ) : campaigns.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No campaigns yet</p>
//                 </div>
//               ) : (
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
//                       <th className="text-left p-3 text-sm font-semibold text-gray-600">Type</th>
//                       <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
//                       <th className="text-left p-3 text-sm font-semibold text-gray-600">Created</th>
//                       <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {campaigns.map((campaign) => (
//                       <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
//                         <td className="p-3">{campaign.name}</td>
//                         <td className="p-3">
//                           <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
//                             {campaign.campaign_type}
//                           </span>
//                         </td>
//                         <td className="p-3">
//                           <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
//                             {campaign.status}
//                           </span>
//                         </td>
//                         <td className="p-3 text-sm text-gray-600">
//                           {new Date(campaign.created_at).toLocaleDateString()}
//                         </td>
//                         <td className="p-3">
//                           <div className="flex space-x-2">
//                             <button
//                               className="text-sm text-indigo-600 hover:text-indigo-800"
//                               onClick={() => {
//                                 setSelectedCampaign(campaign);
//                                 setShowNewCampaignForm(true);
//                               }}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="text-sm text-red-600 hover:text-red-800"
//                               onClick={() => {
//                                 setSelectedCampaign(campaign);
//                                 setShowDeleteConfirm(true);
//                               }}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Pending Approvals Section */}
//         <div className="lg:col-span-1">
//           <UserApprovalList
//             pendingUsers={[
//                 ...pendingRequests.registration_requests,
//                 ...pendingRequests.role_change_requests
//               ]}
//               onUserActionComplete={handleRequestComplete}
//           />
//         </div>
//       </div>
     

//       {/* Campaign Form Modal */}
//       <CampaignForm 
//         isOpen={showNewCampaignForm}
//         onClose={() => {
//           setShowNewCampaignForm(false);
//           setSelectedCampaign(null);
//         }}
//         campaign={selectedCampaign}
//       />

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={showDeleteConfirm}
//         onClose={() => setShowDeleteConfirm(false)}
//         className="relative z-50"
//       >
//         <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
//             <Dialog.Title className="text-lg font-medium text-gray-900">
//               Delete Campaign
//             </Dialog.Title>
//             <Dialog.Description className="mt-2 text-sm text-gray-500">
//               Are you sure you want to delete this campaign? This action cannot be undone.
//             </Dialog.Description>

//             <div className="mt-4 flex justify-end space-x-2">
//               <button
//                 type="button"
//                 className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                 onClick={() => setShowDeleteConfirm(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
//                 onClick={handleDeleteCampaign}
//               >
//                 Delete
//               </button>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default SuperAdminDashboard;