// frontend/src/services/boats.ts
import { apiClient } from './api';
import {
  BoatListing,
  BoatListingCreate,
  BoatListingUpdate,
  BoatSearchParams
} from '../types/boat';

export class BoatService {
  static async getBoats(params?: BoatSearchParams): Promise<BoatListing[]> {
    return apiClient.get<BoatListing[]>('/boats', params);
  }

  static async getBoat(id: number): Promise<BoatListing> {
    return apiClient.get<BoatListing>(`/boats/${id}`);
  }

  static async getBoatByIndex(index: number): Promise<BoatListing> {
    return apiClient.get<BoatListing>(`/boats/index/${index}`);
  }

  static async createBoat(boatData: BoatListingCreate): Promise<BoatListing> {
    return apiClient.post<BoatListing>('/boats', boatData);
  }

  static async updateBoat(id: number, boatData: BoatListingUpdate): Promise<BoatListing> {
    return apiClient.put<BoatListing>(`/boats/${id}`, boatData);
  }

  static async deleteBoat(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/boats/${id}`);
  }

  static async assignBoatToPosition(boatId: number, positionId: number): Promise<BoatListing> {
    return apiClient.post<BoatListing>(`/boats/${boatId}/assign/${positionId}`);
  }

  static async unassignBoat(boatId: number): Promise<BoatListing> {
    return apiClient.post<BoatListing>(`/boats/${boatId}/unassign`);
  }
}

