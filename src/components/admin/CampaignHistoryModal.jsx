// src/components/admin/CampaignHistoryModal.jsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export const CampaignHistoryModal = ({ isOpen, onClose, campaign, campaignHistory }) => {

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATED':
        return 'bg-green-100 text-green-800';
      case 'UPDATED':
        return 'bg-blue-100 text-blue-800';
      case 'SENT':
        return 'bg-purple-100 text-purple-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[70]">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Campaign History
              </Dialog.Title>
              <p className="mt-1 text-sm text-gray-500">
                History for campaign: {campaign?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
            {campaignHistory?.map((entry, index) => (
              <div key={index} className="relative">
                {index !== campaignHistory.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <ClockIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                        {entry.action}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">
                      {entry.details}
                    </p>
                    
                    <div className="mt-1 text-sm text-gray-500">
                      by {entry.performed_by.full_name} • {entry.performed_by.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};