import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { authService } from '../../services/api'
import toast from 'react-hot-toast';

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('New password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm new password is required')
});

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const handleChangePassword = async (values, { setSubmitting }) => {
    try {
      await authService.changePassword(values.oldPassword, values.newPassword);
      toast.success('Password changed successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Change Password
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <Formik
            initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '' }}
            validationSchema={ChangePasswordSchema}
            onSubmit={handleChangePassword}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Old Password
                  </label>
                  <Field
                    type="password"
                    name="oldPassword"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.oldPassword && touched.oldPassword ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500`}
                  />
                  {errors.oldPassword && touched.oldPassword && (
                    <div className="mt-1 text-sm text-red-500">{errors.oldPassword}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.newPassword && touched.newPassword ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500`}
                  />
                  {errors.newPassword && touched.newPassword && (
                    <div className="mt-1 text-sm text-red-500">{errors.newPassword}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <Field
                    type="password"
                    name="confirmNewPassword"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.confirmNewPassword && touched.confirmNewPassword ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500`}
                  />
                  {errors.confirmNewPassword && touched.confirmNewPassword && (
                    <div className="mt-1 text-sm text-red-500">{errors.confirmNewPassword}</div>
                  )}
                </div>

                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};