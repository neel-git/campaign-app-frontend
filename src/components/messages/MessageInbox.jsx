// src/components/messages/MessageInbox.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MessageItem } from './MessageItem';
import { ShimmerEffect } from '../common/ShimmerEffect';

export const MessageInbox = () => {
  const messages = useSelector(state => state.messages.messages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h1 className="text-lg font-medium leading-6 text-gray-900">
              Messages Inbox
            </h1>
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
                <MessageItem key={message.id} message={message} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};