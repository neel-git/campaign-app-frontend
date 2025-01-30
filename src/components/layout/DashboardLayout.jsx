// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserCircle, LogOut, ChevronDown,Key } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useState } from 'react';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';

export const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/logout');
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <a href="/" className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://cdn.dribbble.com/userupload/14920420/file/original-a185c6761d78169cb1cf275251e62a22.jpg?resize=752x&vertical=center"
                  alt="Practice Management"
                />
                <span className="ml-3 text-gray-800 font-bold">Practice Management</span>
              </a>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center space-x-2">
                      <UserCircle className="w-8 h-8 text-gray-400" />
                      <span className="font-medium text-gray-800">{user?.full_name || 'User'}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
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
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                        >
                          Logout
                          <LogOut className="w-5 h-5 text-gray-500" />
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-gray-50 rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Practice Management. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button onClick={handleChangePassword} className="flex items-center space-x-2 hover:text-gray-700">
                <Key className="w-5 h-5" />
                <span>Change Password</span>
              </button>
              <div>Logged in as {user?.role?.replace('UserRoleType.', '')}</div>
            </div>
          </div>
        </div>
      </footer>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

