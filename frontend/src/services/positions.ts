// frontend/src/services/positions.ts
import { apiClient } from './api';
import {
  BoatPosition,
  BoatPositionCreate,
  BoatPositionUpdate
} from '../types/boat';

export class PositionService {
  static async getPositionsByMap(mapId: number): Promise<BoatPosition[]> {
    return apiClient.get<BoatPosition[]>(`/positions/map/${mapId}`);
  }

  static async getPosition(id: number): Promise<BoatPosition> {
    return apiClient.get<BoatPosition>(`/positions/${id}`);
  }

  static async createPosition(positionData: BoatPositionCreate): Promise<BoatPosition> {
    return apiClient.post<BoatPosition>('/positions', positionData);
  }

  static async updatePosition(id: number, positionData: BoatPositionUpdate): Promise<BoatPosition> {
    return apiClient.put<BoatPosition>(`/positions/${id}`, positionData);
  }

  static async deletePosition(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/positions/${id}`);
  }
}