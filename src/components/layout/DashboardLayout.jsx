// import React from 'react';

// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { logout } from '../../store/slices/authSlice'

// export const DashboardLayout = ({ children }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/logout');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <h1 className="text-xl font-semibold text-gray-900">
//               Practice Management
//             </h1>
//             <button
//               onClick={handleLogout}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main>{children}</main>
//     </div>
//   );
// };

// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserCircle, LogOut, ChevronDown } from 'lucide-react'; // Using lucide icons

const formatRole = (role) => {
    if (!role) return '';
    
    const cleanRole = role.replace('UserRoleType.', '');
    
    return cleanRole
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

export const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/logout');
//   };
const handleLogout = async () => {
    await dispatch(logout());
    navigate('/logout');
  };
  const displayRole = formatRole(user?.role);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Practice Management
            </h1>

            {/* User Menu Dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center space-x-2">
                    {/* User Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircle className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-2">
                      <div className="text-sm text-gray-700 text-right">
                        <p className="font-medium">Hi, {user?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500">{displayRole}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Logged in as {user?.role?.replace('UserRoleType.', '')}
                    </p>
                  </div>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                      >
                        <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};