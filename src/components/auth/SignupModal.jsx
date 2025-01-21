// src/components/auth/SignupModal.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { setPractices,setLoading } from '../../store/slices/practiceSlice';
import { practiceService } from '../../services/api';

// Validation Schema using Yup
const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
    fullName: Yup.string()
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter'
    )
    .matches(
      /[a-z]/,
      'Password must contain at least one lowercase letter'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number'
    )
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
    desiredPracticeId: Yup.string()
    .required('Please select a practice')
});

export const SignupModal = ({ isOpen, onClose, onSwitchToLogin}) => {
  const dispatch = useDispatch();
  const {practices,isLoading} = useSelector(state => state.practices);
  useEffect(() => {
    const fetchPractices = async () => {
      try {
        dispatch(setLoading());
        const activePractices = await practiceService.getActivePractices();
        dispatch(setPractices(activePractices));
      } catch (error) {
        console.error('Error fetching practices:', error);
        toast.error('Failed to load practices');
      }
    };

    if(isOpen) {
      fetchPractices();
    }
  },[isOpen,dispatch]);

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
                    Create Account
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
                    fullName:'',
                    email: '',
                    password: '',
                    desiredPracticeId:''
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                      const formData = {
                        username: values.username,
                        full_name: values.fullName,
                        email: values.email,
                        password: values.password,
                        desired_practice_id: values.desiredPracticeId || null
                      };
                      await authService.signup(formData);
                      toast.success('Signup successful! Please log in.');
                      resetForm();
                      onClose();
                    } catch (error) {
                      toast.error(error.response || 'Signup failed');
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
                          Username *
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
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <Field
                        id="fullName"
                        name="fullName"
                        type="text"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.fullName && touched.fullName 
                            ? 'border-red-500' 
                            : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      />
                      {errors.fullName && touched.fullName && (
                        <div className="mt-1 text-sm text-red-500">{errors.fullName}</div>
                      )}
                    </div>
                      <div>
                        <label 
                          htmlFor="email" 
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email *
                        </label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.email && touched.email 
                              ? 'border-red-500' 
                              : 'border-gray-300'
                          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        />
                        {errors.email && touched.email && (
                          <div className="mt-1 text-sm text-red-500">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="password" 
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password *
                        </label>
                        <Field
                          id="password"
                          name="password"
                          type="password"
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
                        {/* Password requirements helper text */}
                        <div className="mt-1 text-xs text-gray-500">
                          Password must contain:
                          <ul className="list-disc pl-4 space-y-1">
                            <li>At least 8 characters</li>
                            <li>One uppercase letter</li>
                            <li>One lowercase letter</li>
                            <li>One number</li>
                            <li>One special character (!@#$%^&*)</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                <label 
                  htmlFor="desiredPracticeId" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Practice
                </label>
                <Field
                  as="select"
                  id="desiredPracticeId"
                  name="desiredPracticeId"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.desiredPracticeId && touched.desiredPracticeId 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  disabled={isLoading}
                >
                  <option value="">Select a practice</option>
                  {practices.map(practice => (
                    <option key={practice.id} value={practice.id}>
                      {practice.name}
                    </option>
                  ))}
                </Field>
                {isLoading && (
                  <div className="mt-1 text-sm text-gray-500">
                    Loading practices...
                  </div>
                )}
                {errors.desiredPracticeId && touched.desiredPracticeId && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.desiredPracticeId}
                  </div>
                )}
              </div>
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>

                <div className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Log in
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};