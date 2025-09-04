// frontend/src/components/map/MapForm.tsx
import React, { useState, useEffect } from 'react';
import { Map, MapCreate, MapUpdate } from '../../types/map';
import { useCreateMap, useUpdateMap } from '../../hooks/useMaps';
import { useUIStore } from '../../stores/uiStore';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FileUpload } from '../common/FileUpload';

interface MapFormProps {
  map?: Map;
}

export const MapForm: React.FC<MapFormProps> = ({ map }) => {
  const { showMapForm, hideMapFormModal } = useUIStore();
  const createMap = useCreateMap();
  const updateMap = useUpdateMap();
  
  const [formData, setFormData] = useState<MapCreate>({
    name: '',
    description: '',
    image_path: '',
    image_width: 794,
    image_height: 1123,
    is_active: true,
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load map data when editing
  useEffect(() => {
    if (map) {
      setFormData({
        name: map.name,
        description: map.description || '',
        image_path: map.image_path,
        image_width: map.image_width,
        image_height: map.image_height,
        is_active: map.is_active,
      });
    } else {
      // Reset form for new map
      setFormData({
        name: '',
        description: '',
        image_path: '',
        image_width: 794,
        image_height: 1123,
        is_active: true,
      });
      setUploadedFile(null);
    }
    setErrors({});
  }, [map]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    
    // Create a preview and try to get dimensions
    const img = new Image();
    img.onload = () => {
      setFormData(prev => ({
        ...prev,
        image_width: img.naturalWidth,
        image_height: img.naturalHeight,
        image_path: file.name
      }));
    };
    img.src = URL.createObjectURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Map name is required';
    }
    
    if (!map && !uploadedFile) {
      newErrors.image_path = 'Map image is required';
    }
    
    if (formData.image_width <= 0) {
      newErrors.image_width = 'Width must be greater than 0';
    }
    
    if (formData.image_height <= 0) {
      newErrors.image_height = 'Height must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // TODO: Handle file upload to server first if there's an uploaded file
      // For now, we'll just use the filename
      
      if (map) {
        await updateMap.mutateAsync({
          id: map.id,
          data: formData as MapUpdate
        });
      } else {
        await createMap.mutateAsync(formData);
      }
      
      hideMapFormModal();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createMap.isPending || updateMap.isPending;

  return (
    <Modal
      isOpen={showMapForm}
      onClose={hideMapFormModal}
      title={map ? 'Edit Map' : 'Add New Map'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Map Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Pier 11 Marina"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description of this marina property..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marina Layout Image {!map && '*'}
          </label>
          <FileUpload
            onFileSelect={handleFileUpload}
            acceptedTypes={['image/jpeg', 'image/png', 'image/gif']}
            maxSize={10 * 1024 * 1024} // 10MB
            disabled={isLoading}
          />
          {errors.image_path && <p className="text-red-600 text-sm mt-1">{errors.image_path}</p>}
          
          {(uploadedFile || map) && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Current image: {uploadedFile?.name || formData.image_path}
              </p>
            </div>
          )}
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="image_width" className="block text-sm font-medium text-gray-700 mb-1">
              Width (px) *
            </label>
            <input
              id="image_width"
              name="image_width"
              type="number"
              min="1"
              value={formData.image_width}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image_width ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.image_width && <p className="text-red-600 text-sm mt-1">{errors.image_width}</p>}
          </div>
          
          <div>
            <label htmlFor="image_height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (px) *
            </label>
            <input
              id="image_height"
              name="image_height"
              type="number"
              min="1"
              value={formData.image_height}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image_height ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.image_height && <p className="text-red-600 text-sm mt-1">{errors.image_height}</p>}
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Map is active (available for selection)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={hideMapFormModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {map ? 'Update Map' : 'Create Map'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};