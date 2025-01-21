// // src/components/messages/MessageItem.jsx
// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { markAsRead } from '../../store/slices/messageSlice';
// import { format } from 'date-fns';

// export const MessageItem = ({ message }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const dispatch = useDispatch();

//   const handleClick = () => {
//     setIsExpanded(!isExpanded);
//     if (!message.isRead) {
//       dispatch(markAsRead(message.id));
//     }
//   };

//   return (
//     <div 
//       className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
//         !message.isRead ? 'bg-blue-50' : ''
//       }`}
//       onClick={handleClick}
//     >
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <h2 className={`text-lg ${!message.isRead ? 'font-semibold' : 'font-medium'}`}>
//             {message.campaignName}
//           </h2>
//           <p className="text-sm text-gray-500">
//             {format(new Date(message.receivedAt), 'MMM d, yyyy h:mm a')}
//           </p>
//         </div>
//         {!message.isRead && (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//             New
//           </span>
//         )}
//       </div>
//       <div className={`mt-2 ${isExpanded ? '' : 'line-clamp-2'} text-gray-600`}>
//         {message.content}
//       </div>
//       {message.content.length > 150 && (
//         <button 
//           className="mt-2 text-sm text-blue-600 hover:text-blue-800"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsExpanded(!isExpanded);
//           }}
//         >
//           {isExpanded ? 'Show less' : 'Read more'}
//         </button>
//       )}
//     </div>
//   );
// };

// src/components/messages/MessageItem.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { markAsRead } from '../../store/slices/messageSlice';
import { format } from 'date-fns';
import { MessageDetail } from './MessageDetail';

export const MessageItem = ({ message }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const dispatch = useDispatch();

  const truncatedContent = message.content.length > 150 
    ? `${message.content.slice(0, 150)}...` 
    : message.content;

  const handleMarkAsRead = () => {
    if (!message.isRead) {
      dispatch(markAsRead(message.id));
    }
  };

  return (
    <>
      <div 
        className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 ${
          !message.isRead ? 'bg-blue-50' : ''
        }`}
        onClick={() => setIsDetailOpen(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className={`text-lg ${!message.isRead ? 'font-semibold' : 'font-medium'}`}>
              {message.campaignName}
            </h2>
            <p className="text-sm text-gray-500">
              {format(new Date(message.receivedAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          {!message.isRead && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              New
            </span>
          )}
        </div>
        <div className="mt-2 text-gray-600">
          {truncatedContent}
        </div>
      </div>

      <MessageDetail
        message={message}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
};