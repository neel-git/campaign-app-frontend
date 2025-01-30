// src/components/messages/MessageItem.jsx
import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { messageService } from '../../services/api';
import { deleteMessage,markAsRead } from '../../store/slices/messageSlice';
import { format } from 'date-fns';
import { MessageDetail } from './MessageDetail';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';


export const MessageItem = ({ message, onRefresh }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dispatch = useDispatch();
  const [localMessage, setLocalMessage] = useState(message); 

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date unavailable';
    }
  };

  useEffect(() => {
    setLocalMessage(message);
  }, [message]);


  const handleMarkAsRead = async () => {
    if (!localMessage.is_read) {
      try {
        await messageService.markAsRead(localMessage.id);
        dispatch(markAsRead(localMessage.id));
        
        setLocalMessage(prev => ({
          ...prev,
          is_read: true
        }));

        setIsDetailOpen(false);
      } catch (error) {
        toast.error('Failed to mark message as read');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await messageService.deleteMessage(message.id);
      dispatch(deleteMessage(message.id));
      setShowDeleteConfirm(false);
      setIsDetailOpen(false);
      toast.success('Message deleted successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const truncatedContent = message.content.length > 100 
    ? `${message.content.slice(0, 100)}...` 
    : message.content;

  return (
    <>
      <div className={`p-4 hover:bg-gray-50 transition-all duration-300 ${
        !message.is_read ? 'bg-blue-50' : ''
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex-1 cursor-pointer" onClick={() => setIsDetailOpen(true)}>
            <h2 className={`text-lg ${!message.is_read ? 'font-semibold' : 'font-medium'}`}>
              {message.campaign_name} {/* Changed from campaignName */}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDate(message.created_at)} {/* Changed from receivedAt */}
            </p>
          </div>
          <div className="flex space-x-2">
            {!message.is_read && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="mt-2 text-gray-600 cursor-pointer" onClick={() => setIsDetailOpen(true)}>
          {truncatedContent}
        </div>
      </div>

      <MessageDetail
        message={localMessage}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onMarkAsRead={handleMarkAsRead}
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
              Delete Message
            </Dialog.Title>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
