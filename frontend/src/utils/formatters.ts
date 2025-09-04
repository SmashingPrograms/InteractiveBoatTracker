// frontend/src/utils/formatters.ts
import { BoatListing } from '../types/boat';

export const formatBoatTitle = (boat: BoatListing): string => {
  const parts: string[] = [`#${boat.index}`];
  
  if (boat.name) parts.push(boat.name);
  if (boat.make_model) parts.push(boat.make_model);
  if (boat.size) parts.push(`(${boat.size})`);
  
  return parts.join(' ');
};

export const formatBoatSubtitle = (boat: BoatListing): string => {
  const parts: string[] = [boat.customer_name];
  
  if (boat.vehicle_type) parts.push(`• ${boat.vehicle_type}`);
  if (boat.section) parts.push(`• Section ${boat.section}`);
  
  return parts.join(' ');
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

