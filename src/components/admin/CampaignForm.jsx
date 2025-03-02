// src/components/admin/CampaignForm.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { addCampaign, updateCampaign} from '../../store/slices/campaignSlice';
import { campaignService,practiceService } from '../../services/api';
import toast from 'react-hot-toast';
import { useState,useEffect } from 'react';

const campaignSchema = Yup.object().shape({
  name: Yup.string()
    .required('Campaign name is required')
    .min(5, 'Campaign name must be at least 5 characters')
    .max(255, 'Campaign name must be less than 255 characters'),
  content: Yup.string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
  description: Yup.string()
    .nullable(),
  campaignType: Yup.string()
    .required('Campaign type is required')
    .oneOf(['DEFAULT', 'CUSTOM'], 'Invalid campaign type'),
  deliveryType: Yup.string()
    .required('Delivery type is required')
    .oneOf(['IMMEDIATE', 'SCHEDULED'], 'Invalid delivery type'),
  scheduledDate: Yup.lazy((deliveryType) => {
    return deliveryType === 'SCHEDULED'
      ? Yup.date()
            .required('Schedule date is required')
            .min(new Date(), 'Schedule date must be in the future')
        : Yup.date().nullable();
    }),
    scheduledTime: Yup.lazy((deliveryType) => {
      return deliveryType === 'SCHEDULED'
        ? Yup.string().required('Schedule time is required')
        : Yup.string().nullable();
    }),
  targetPractices: Yup.array().default([]),
  targetRoles: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one role')
});


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

export const CampaignForm = ({ isOpen, onClose, campaign, onSuccess}) => {
  const dispatch = useDispatch();
  const practices = useSelector(state => state.practices.practices);
  const user = useSelector(state => state.auth.user);
  const isSuperAdmin = user?.role === "Practice by Numbers Support";
  const [userPractice, setUserPractice] = useState(null);
  const [isLoadingPractice, setIsLoadingPractice] = useState(!isSuperAdmin);

  // Fetch user's practice when component mounts
  useEffect(() => {
    const fetchUserPractice = async () => {
      if (!isSuperAdmin) {
        try {
          setIsLoadingPractice(true);
          const practice = await practiceService.getUserPractice();
          setUserPractice(practice);
          
          if (!practice) {
            toast.error('You are not assigned to any practice. Please contact an administrator.');
          }
        } catch (error) {
          toast.error('Failed to fetch practice information');
        } finally {
          setIsLoadingPractice(false);
        }
      }
    };

    fetchUserPractice();
  }, [isSuperAdmin]);

  const initialValues = {
    name: campaign?.name || '',
    description: campaign?.description || '',
    content: campaign?.content || '',
    campaignType: campaign?.campaign_type || (isSuperAdmin ? 'DEFAULT' : 'CUSTOM'),
    deliveryType: campaign?.delivery_type || 'IMMEDIATE',
    scheduledDate: campaign?.scheduled_date ? new Date(campaign.scheduled_date).toISOString().split('T')[0] : '',
    scheduledTime: campaign?.scheduled_date ? new Date(campaign.scheduled_date).toISOString().split('T')[1].slice(0, 5) : '',
    targetPractices: campaign?.practice_associations?.map(pa => pa.practice_id) || [],
    targetRoles: campaign?.target_roles || []
  };

  const handleSubmit = async (values, { setSubmitting, resetForm ,setFieldError}) => {
    try {
      if (isSuperAdmin && (!values.targetPractices || values.targetPractices.length === 0)) {
        setFieldError('targetPractices', 'Select at least one practice');
        return;
      }
      const targetPractices = isSuperAdmin 
      ? values.targetPractices.map(id => parseInt(id))
      : userPractice ? [userPractice.id] : [];

      const formattedData = {
        name: values.name,
        content: values.content,
        description: values.description || null,
        campaign_type: isSuperAdmin ? 'DEFAULT' : 'CUSTOM',
        delivery_type: values.deliveryType,
        target_roles: values.targetRoles,
        target_practices: targetPractices,
        ...(values.deliveryType === 'SCHEDULED' && {
          scheduled_date: `${values.scheduledDate}T${values.scheduledTime}:00Z`
        })
      };

      let response;
      if (campaign) {
        response = await campaignService.updateCampaign(campaign.id, formattedData);
        dispatch(updateCampaign(response));
        toast.success('Campaign updated successfully');
      } else {
        response = await campaignService.createCampaign(formattedData);
        dispatch(addCampaign(response));
        toast.success('Campaign created successfully');
      }
      await onSuccess();
      toast.success(`Campaign ${campaign ? 'updated' : 'created'} successfully`);
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${campaign ? 'update' : 'create'} campaign`);
    } finally {
      setSubmitting(false);
    }
  };

  const roleTypes = isSuperAdmin 
    ? [
        { id: 'Admin', label: 'Admin' },
        { id: 'Practice User', label: 'Practice User' }
      ]
    : [{ id: 'Practice User', label: 'Practice User' }];

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
            validationContext={{ userRole: user?.role }}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Type
                    </label>
                    <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
                      {isSuperAdmin ? 'Default Campaign' : 'Custom Campaign'}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Practices
                    </label>
                    {isSuperAdmin ? (
                      <>
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
                      </>
                    ) : (
                      <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
                        {isLoadingPractice ? (
                          'Loading practice information...'
                        ) : (
                          userPractice ? userPractice.name : 'No practice assigned'
                        )}
                      </div>
                    )}
                    <ErrorMessage
                      name="targetPractices"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

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
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}>
                      {isSubmitting ? (campaign ? 'Updating...' : 'Creating...') : (campaign ? 'Update Campaign' : 'Create Campaign')}
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
