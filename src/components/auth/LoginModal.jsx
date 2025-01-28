// src/components/auth/LoginModal.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { authService } from '../../services/api';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required'),
  password: Yup.string()
    .required('Password is required'),
});

export const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Login to your account
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    username: '',
                    password: '',
                  }}
                  validationSchema={LoginSchema}
                  onSubmit={async (values, { setSubmitting, setFieldError }) => {
                    try {
                      console.log('Form values:',values);
                      const response = await authService.login({
                        username: values.username,
                        password: values.password
                      });
                      // console.log('Login response:',response);
                      dispatch(setUser(response));
                     // console.log('Navigation starting for role:', response.role);
                      toast.success('Login successful!');
                      onClose();
                      // Redirect based on role
                      if (response.role === "Practice User") {
                        //console.log('Navigating to inbox');
                        navigate('/inbox');
                      }else if (response.role === "Admin") {
                        navigate('/admin-dashboard');
                      } else if (response.role === "Practice by Numbers Support") {
                        console.log("Navigating to super admin dashboard");
                        navigate('/super-admin-dashboard');
                      }
                    } catch (error) {
                      // Handle different types of errors
                      console.log('Login error',error);
                      if (error) {
                        toast.error(error.error || 'Login failed');
                      } else if (error.message) {
                        toast.error(error.message);
                      } else {
                        toast.error('An error occurred during login');
                      }
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <label 
                          htmlFor="username" 
                          className="block text-sm font-medium text-gray-700"
                        >
                          Username
                        </label>
                        <Field
                          id="username"
                          name="username"
                          type="text"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.username && touched.username 
                              ? 'border-red-500' 
                              : 'border-gray-300'
                          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        />
                        {errors.username && touched.username && (
                          <div className="mt-1 text-sm text-red-500">
                            {errors.username}
                          </div>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="password" 
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="off"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.password && touched.password 
                              ? 'border-red-500' 
                              : 'border-gray-300'
                          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        />
                        {errors.password && touched.password && (
                          <div className="mt-1 text-sm text-red-500">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                          </label>
                        </div>

                        <button
                          type="button"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Logging in...' : 'Log in'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};