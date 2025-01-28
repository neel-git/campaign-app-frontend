// src/components/admin/PracticeForm.jsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { practiceService } from '../../services/api';
import { useDispatch } from 'react-redux';
import { addPractice,updatePractice } from '../../store/slices/practiceSlice';
import toast from 'react-hot-toast';

const PracticeSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  description: Yup.string(),
  is_active: Yup.boolean()
});

export const PracticeForm = ({ isOpen, onClose, practice, onSubmit }) => {
    const dispatch = useDispatch();

    const initialValues = practice ? {
    name: practice.name,
    description: practice.description || '',
    is_active: practice.is_active
  } : {
    name: '',
    description: '',
    is_active: true
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (practice) {
        const updatedPractice = await practiceService.updatePractice(practice.id, values);
        dispatch(updatePractice({ id: practice.id, ...updatedPractice }));
        toast.success('Practice updated successfully');
      } else {
        const newPractice = await practiceService.createPractice(values);
        dispatch(addPractice(newPractice));
        toast.success('Practice created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save practice');
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
              {practice ? 'Edit Practice' : 'New Practice'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={PracticeSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Practice Name *
                  </label>
                  <Field
                    name="name"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500`}
                  />
                  {errors.name && touched.name && (
                    <div className="mt-1 text-sm text-red-500">{errors.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="3"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="is_active"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
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
                    {isSubmitting ? 'Saving...' : practice ? 'Update' : 'Create'}
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