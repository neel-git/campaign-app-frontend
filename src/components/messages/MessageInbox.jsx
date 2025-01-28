// src/components/messages/MessageInbox.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { MessageItem } from './MessageItem';
import { ShimmerEffect } from '../common/ShimmerEffect';
import { ArrowUpRight } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { authService,messageService } from '../../services/api';
import { setLoading, setMessages,setError } from '../../store/slices/messageSlice';
//import { setError } from '../../store/slices/campaignSlice';

export const MessageInbox = () => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.messages.messages);
  const user = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      dispatch(setLoading());
      // Add debug logging
      console.log('Fetching messages for user:', user?.id);
      const data = await messageService.getMessages();
      console.log('Received messages:', data);
      dispatch(setMessages(data));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      dispatch(setError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChangeRequest = async () => {
    try {
      setIsSubmitting(true);
      await authService.requestRoleChange({
        requested_role: "Admin"
      });
      toast.success("Role change request submitted successfully!");
      setShowRoleChangeDialog(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit role change request");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h1 className="text-lg font-medium leading-6 text-gray-900">
              Messages Inbox
            </h1>
            {user?.role === 'Practice User' && (
              <button
                onClick={() => setShowRoleChangeDialog(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Request Admin Role
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <>
                <ShimmerEffect />
                <ShimmerEffect />
                <ShimmerEffect />
              </>
            ) : messages.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                No messages in your inbox
              </p>
            ) : (
              messages.map(message => (
                <MessageItem key={message.id} message={message} onRefresh={fetchMessages}/>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={showRoleChangeDialog}
        onClose={() => !isSubmitting && setShowRoleChangeDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Request Role Change
            </Dialog.Title>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to request a role change to Admin? This will need to be approved by the relevant authorities.
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setShowRoleChangeDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                onClick={handleRoleChangeRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};


// return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
//             <h1 className="text-lg font-medium leading-6 text-gray-900">
//               Messages Inbox
//             </h1>
//           </div>
          
//           <div className="divide-y divide-gray-200">
//             {isLoading ? (
//               <>
//                 <ShimmerEffect />
//                 <ShimmerEffect />
//                 <ShimmerEffect />
//               </>
//             ) : messages.length === 0 ? (
//               <p className="p-4 text-center text-gray-500">
//                 No messages in your inbox
//               </p>
//             ) : (
//               messages.map(message => (
//                 <MessageItem key={message.id} message={message} />
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>