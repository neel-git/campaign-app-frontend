// src/pages/PracticeManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { setPractices,deletePractice,updatePractice, setLoading,setError} from '../../store/slices/practiceSlice';
import { practiceService } from '../../services/api';
import toast from 'react-hot-toast';
import { PracticeForm } from '../admin/PracticeForm';
import { motion } from 'framer-motion';

export const PracticeManagementPage = () => {
  const dispatch = useDispatch();
  const { practices, isLoading } = useSelector((state) => state.practices);
  const [showNewPracticeForm, setShowNewPracticeForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(null);

  useEffect(() => {
    fetchPractices();
  }, []);

  const fetchPractices = async () => {
    try {
      dispatch(setLoading(true));
      const data = await practiceService.getPractices(); // Changed to getPractices
      dispatch(setPractices(data));
    } catch (error) {
      toast.error('Failed to fetch practices');
      dispatch(setError(error.message));
    }
  };

  // Handle practice updates
  const handlePracticeUpdate = async (practiceData) => {
    try {
      const updatedPractice = await practiceService.updatePractice(
        practiceData.id,
        practiceData
      );
      dispatch(updatePractice(updatedPractice));
      toast.success('Practice updated successfully');
      setShowNewPracticeForm(false);
      setSelectedPractice(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update practice');
    }
  };
  // Handle practice deletion
  const handleDeletePractice = async () => {
    if (!selectedPractice) return;

    try {
      await practiceService.deletePractice(selectedPractice.id);
      dispatch(deletePractice(selectedPractice.id));
      toast.success('Practice deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedPractice(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete practice');
    }
  };

    // Handle practice status toggle
    const handleToggleStatus = async (practice) => {
        try {
          const updatedPractice = await practiceService.togglePracticeStatus(
            practice.id,
            !practice.is_active
          );
          dispatch(updatePractice(updatedPractice));
          toast.success(`Practice ${updatedPractice.is_active ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
          toast.error('Failed to update practice status');
        }
      };
    
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Practice Management</h2>
        <button
          onClick={() => setShowNewPracticeForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Practice
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading practices...</p>
        </div>
      ) : practices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No practices yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {practices.map((practice) => (
                <tr key={practice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{practice.name}</td>
                  <td className="p-3">{practice.description}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        practice.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {practice.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                        onClick={() => {
                          setSelectedPractice(practice);
                          setShowNewPracticeForm(true);
                        }}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={() => {
                          setSelectedPractice(practice);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PracticeForm
        isOpen={showNewPracticeForm}
        onClose={() => {
          setShowNewPracticeForm(false);
          setSelectedPractice(null);
        }}
        practice={selectedPractice}
      />

      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Delete Practice
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this practice? This action cannot be undone.
            </Dialog.Description>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleDeletePractice}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

//export default PracticeManagementPage;