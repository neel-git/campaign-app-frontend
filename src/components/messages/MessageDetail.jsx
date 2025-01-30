// src/components/messages/MessageDetail.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const MessageDetail = ({ message, isOpen, onClose, onMarkAsRead, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date unavailable';
    }
  };

  const handleMarkAsRead = async () => {
    if (!message.is_read) {
      await onMarkAsRead();
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      {message.campaign_name}
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                    {formatDate(message.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="mt-4 text-gray-600 leading-relaxed">
                  {message.content}
                </div>

                <div className="mt-6 flex items-center space-x-2">
                  <input
                    type="radio"
                    id="markAsRead"
                    checked={message.is_read}
                    onChange={handleMarkAsRead}
                    disabled={message.is_read}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label 
                    htmlFor="markAsRead" 
                    className={`text-sm ${message.isRead ? 'text-gray-500' : 'text-gray-700'}`}
                  >
                    {message.is_read ? 'Message marked as read' : 'Mark as read'}
                  </label>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};