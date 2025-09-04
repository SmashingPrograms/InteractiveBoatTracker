// frontend/src/utils/validators.ts
import { BoatListingCreate } from '../types/boat';
import { BOAT_SECTIONS } from './constants';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateBoatListing = (data: BoatListingCreate): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!data.customer_name.trim()) {
    errors.push({ field: 'customer_name', message: 'Customer name is required' });
  }
  
  if (!data.index || data.index <= 0) {
    errors.push({ field: 'index', message: 'Index must be a positive number' });
  }
  
  // Optional field validation
  if (data.section && !BOAT_SECTIONS.includes(data.section as any)) {
    errors.push({ 
      field: 'section', 
      message: `Section must be one of: ${BOAT_SECTIONS.join(', ')}` 
    });
  }
  
  if (data.customer_name.length > 100) {
    errors.push({ 
      field: 'customer_name', 
      message: 'Customer name must be less than 100 characters' 
    });
  }
  
  if (data.name && data.name.length > 100) {
    errors.push({ 
      field: 'name', 
      message: 'Boat name must be less than 100 characters' 
    });
  }
  
  return errors;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

