// frontend/src/components/boat/BoatForm.tsx
import React, { useState, useEffect } from 'react';
import { BoatListing, BoatListingCreate, BoatListingUpdate } from '../../types/boat';
import { useCreateBoat, useUpdateBoat } from '../../hooks/useBoats';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useUIStore } from '../../stores/uiStore';

interface BoatFormProps {
  boat?: BoatListing;
}

export const BoatForm: React.FC<BoatFormProps> = ({ boat }) => {
  const { showBoatForm, hideBoatFormModal } = useUIStore();
  const createBoat = useCreateBoat();
  const updateBoat = useUpdateBoat();
  
  const [formData, setFormData] = useState<BoatListingCreate>({
    index: 0,
    customer_name: '',
    name: '',
    size: '',
    make_model: '',
    vehicle_type: '',
    section: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load boat data when editing
  useEffect(() => {
    if (boat) {
      setFormData({
        index: boat.index,
        customer_name: boat.customer_name,
        name: boat.name || '',
        size: boat.size || '',
        make_model: boat.make_model || '',
        vehicle_type: boat.vehicle_type || '',
        section: boat.section || '',
        notes: boat.notes || '',
      });
    } else {
      // Reset form for new boat
      setFormData({
        index: 0,
        customer_name: '',
        name: '',
        size: '',
        make_model: '',
        vehicle_type: '',
        section: '',
        notes: '',
      });
    }
    setErrors({});
  }, [boat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }
    
    if (!formData.index || formData.index <= 0) {
      newErrors.index = 'Index must be a positive number';
    }
    
    if (formData.section && !['A', 'B', 'C', 'D', 'E', 'F'].includes(formData.section.toUpperCase())) {
      newErrors.section = 'Section must be A, B, C, D, E, or F';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (boat) {
        await updateBoat.mutateAsync({
          id: boat.id,
          data: formData as BoatListingUpdate
        });
      } else {
        await createBoat.mutateAsync(formData);
      }
      
      hideBoatFormModal();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createBoat.isPending || updateBoat.isPending;

  return (
    <Modal
      isOpen={showBoatForm}
      onClose={hideBoatFormModal}
      title={boat ? 'Edit Boat' : 'Add New Boat'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
              Index *
            </label>
            <input
              id="index"
              name="index"
              type="number"
              min="1"
              value={formData.index}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.index ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.index && <p className="text-red-600 text-sm mt-1">{errors.index}</p>}
          </div>
          
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.section ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Select section</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
              <option value="E">Section E</option>
              <option value="F">Section F</option>
            </select>
            {errors.section && <p className="text-red-600 text-sm mt-1">{errors.section}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            id="customer_name"
            name="customer_name"
            type="text"
            value={formData.customer_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customer_name ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.customer_name && <p className="text-red-600 text-sm mt-1">{errors.customer_name}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Boat Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <input
              id="size"
              name="size"
              type="text"
              placeholder="e.g., 30 ft"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <input
              id="vehicle_type"
              name="vehicle_type"
              type="text"
              placeholder="e.g., boat, trailer, jetski"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="make_model" className="block text-sm font-medium text-gray-700 mb-1">
            Make & Model
          </label>
          <input
            id="make_model"
            name="make_model"
            type="text"
            placeholder="e.g., Sea Ray Sundancer"
            value={formData.make_model}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={hideBoatFormModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {boat ? 'Update Boat' : 'Create Boat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};