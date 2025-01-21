// src/components/admin/CampaignForm.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { addCampaign } from '../../store/slices/campaignSlice';
import { campaignService } from '../../services/api';
import toast from 'react-hot-toast';

const campaignSchema = Yup.object().shape({
  name: Yup.string()
    .required('Campaign name is required')
    .min(3, 'Campaign name must be at least 3 characters'),
  content: Yup.string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
  description: Yup.string(),
  campaignType: Yup.string().required('Campaign type is required'),
  deliveryType: Yup.string().required('Delivery type is required'),
  scheduledDate: Yup.date().when('deliveryType', {
    is: 'SCHEDULED',
    then: Yup.date().required('Schedule date is required')
  }),
  scheduledTime: Yup.string().when('deliveryType', {
    is: 'SCHEDULED',
    then: Yup.string().required('Schedule time is required')
  }),
  targetPractices: Yup.array().min(1, 'Select at least one practice'),
  targetRoles: Yup.array().min(1, 'Select at least one role')
});

// Custom Field Wrapper Component
const FormField = ({ label, name, type = 'text', as, placeholder, children, className = '', icon: Icon }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      )}
      <Field
        id={name}
        name={name}
        as={as}
        type={type}
        placeholder={placeholder}
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm 
          focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          ${Icon ? 'pl-10' : 'pl-3'}
          ${as === 'select' ? 'pr-10' : 'pr-3'}
          py-2 text-gray-900 placeholder-gray-500
          transition-colors duration-200
          disabled:bg-gray-50 disabled:text-gray-500
        `}
      >
        {children}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-600 font-medium"
      />
    </div>
  </div>
);

const CampaignForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const practices = useSelector(state => state.practices.practices);
  const user = useSelector(state => state.auth.user);

  const initialValues = {
    name: '',
    description: '',
    content: '',
    campaignType: user?.role === 'UserRoleType.super_admin' ? 'DEFAULT' : 'CUSTOM',
    deliveryType: 'IMMEDIATE',
    scheduledDate: '',
    scheduledTime: '',
    targetPractices: [],
    targetRoles: []
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedData = {
        ...values,
        scheduled_at: values.deliveryType === 'SCHEDULED' 
          ? `${values.scheduledDate}T${values.scheduledTime}` 
          : null
      };

      const response = await campaignService.createCampaign(formattedData);
      dispatch(addCampaign(response));
      toast.success('Campaign created successfully');
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const roleTypes = [
    { id: 'admin', label: 'Admin' },
    { id: 'practice_user', label: 'Practice User' }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[60]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-xl bg-white p-6 w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Create New Campaign
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={campaignSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                <FormField
                  label="Campaign Name"
                  name="name"
                  placeholder="Enter campaign name..."
                />

                <FormField
                  label="Description"
                  name="description"
                  as="textarea"
                  placeholder="Enter campaign description..."
                  className="col-span-2"
                />

                <FormField
                  label="Content"
                  name="content"
                  as="textarea"
                  placeholder="Enter campaign content..."
                  className="col-span-2"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campaign Type - Read only field based on user role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Type
                    </label>
                    <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
                      {user?.role === 'UserRoleType.super_admin' ? 'Default Campaign' : 'Custom Campaign'}
                    </div>
                  </div>

                  <FormField
                    label="Delivery Type"
                    name="deliveryType"
                    as="select"
                  >
                    <option value="IMMEDIATE">Immediate</option>
                    <option value="SCHEDULED">Scheduled</option>
                  </FormField>
                </div>

                {values.deliveryType === 'SCHEDULED' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Schedule Date"
                      name="scheduledDate"
                      type="date"
                      icon={CalendarIcon}
                      min={new Date().toISOString().split('T')[0]}
                    />

                    <FormField
                      label="Schedule Time"
                      name="scheduledTime"
                      type="time"
                      icon={ClockIcon}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Target Practices as Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Practices
                    </label>
                    <Field
                      as="select"
                      name="targetPractices"
                      multiple={true}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      {practices.map(practice => (
                        <option key={practice.id} value={practice.id.toString()}>
                          {practice.name}
                        </option>
                      ))}
                    </Field>
                    <p className="mt-1 text-sm text-gray-500">
                      Hold Ctrl (Windows) or Command (Mac) to select multiple practices
                    </p>
                    <ErrorMessage
                      name="targetPractices"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  {/* Target Roles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Roles
                    </label>
                    <div className="space-y-2">
                      {roleTypes.map(role => (
                        <label key={role.id} className="flex items-center">
                          <Field
                            type="checkbox"
                            name="targetRoles"
                            value={role.id}
                            className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-4 w-4"
                          />
                          <span className="ml-2 text-gray-700">{role.label}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="targetRoles"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>

                {/* Sticky footer with buttons */}
                <div className="sticky bottom-0 bg-white pt-6 border-t mt-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Campaign'}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CampaignForm;
// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { Dialog } from '@headlessui/react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { useDispatch, useSelector } from 'react-redux';
// import { addCampaign } from '../../store/slices/campaignSlice';
// import { campaignService } from '../../services/api';
// import toast from 'react-hot-toast';

// const campaignSchema = Yup.object().shape({
//   name: Yup.string()
//     .required('Campaign name is required')
//     .min(3, 'Campaign name must be at least 3 characters'),
//   content: Yup.string()
//     .required('Content is required')
//     .min(10, 'Content must be at least 10 characters'),
//   description: Yup.string(),
//   campaignType: Yup.string().required('Campaign type is required'),
//   deliveryType: Yup.string().required('Delivery type is required'),
//   scheduledDate: Yup.date().when('deliveryType', {
//     is: 'SCHEDULED',
//     then: Yup.date().required('Schedule date is required')
//   }),
//   scheduledTime: Yup.string().when('deliveryType', {
//     is: 'SCHEDULED',
//     then: Yup.string().required('Schedule time is required')
//   }),
//   targetPractices: Yup.array().min(1, 'Select at least one practice'),
//   targetRoles: Yup.array().min(1, 'Select at least one role')
// });

// const CampaignForm = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch();
//   const practices = useSelector(state => state.practices.practices);

//   const initialValues = {
//     name: '',
//     description: '',
//     content: '',
//     campaignType: 'DEFAULT',
//     deliveryType: 'IMMEDIATE',
//     scheduledDate: '',
//     scheduledTime: '',
//     targetPractices: [],
//     targetRoles: []
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const formattedData = {
//         ...values,
//         scheduled_at: values.deliveryType === 'SCHEDULED' 
//           ? `${values.scheduledDate}T${values.scheduledTime}` 
//           : null
//       };

//       const response = await campaignService.createCampaign(formattedData);
//       dispatch(addCampaign(response));
//       toast.success('Campaign created successfully');
//       resetForm();
//       onClose();
//     } catch (error) {
//       toast.error(error.message || 'Failed to create campaign');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="mx-auto max-w-3xl rounded bg-white p-6 w-full">
//           <div className="flex justify-between items-center mb-4">
//             <Dialog.Title className="text-lg font-medium">Create New Campaign</Dialog.Title>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
//               <XMarkIcon className="h-6 w-6" />
//             </button>
//           </div>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={campaignSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting, values }) => (
//               <Form className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Campaign Name
//                   </label>
//                   <Field
//                     name="name"
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                   />
//                   <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Description
//                   </label>
//                   <Field
//                     as="textarea"
//                     name="description"
//                     rows="3"
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Content
//                   </label>
//                   <Field
//                     as="textarea"
//                     name="content"
//                     rows="5"
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                   />
//                   <ErrorMessage name="content" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Delivery Type
//                     </label>
//                     <Field
//                       as="select"
//                       name="deliveryType"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                     >
//                       <option value="IMMEDIATE">Immediate</option>
//                       <option value="SCHEDULED">Scheduled</option>
//                     </Field>
//                   </div>

//                   {values.deliveryType === 'SCHEDULED' && (
//                     <>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Schedule Date
//                         </label>
//                         <Field
//                           type="date"
//                           name="scheduledDate"
//                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         />
//                         <ErrorMessage name="scheduledDate" component="div" className="mt-1 text-sm text-red-600" />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Schedule Time
//                         </label>
//                         <Field
//                           type="time"
//                           name="scheduledTime"
//                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                         />
//                         <ErrorMessage name="scheduledTime" component="div" className="mt-1 text-sm text-red-600" />
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={onClose}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//                   >
//                     {isSubmitting ? 'Creating...' : 'Create Campaign'}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// };

// export default CampaignForm;