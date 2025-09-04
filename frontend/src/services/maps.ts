// frontend/src/services/maps.ts
import { apiClient } from './api';
import { Map, MapCreate, MapUpdate, MapWithBoats } from '../types/map';
import { PaginationParams } from '../types/api';

export interface MapSearchParams extends PaginationParams {
  active_only?: boolean;
}

export class MapService {
  static async getMaps(params?: MapSearchParams): Promise<Map[]> {
    return apiClient.get<Map[]>('/maps', params);
  }

  static async getMap(id: number): Promise<Map> {
    return apiClient.get<Map>(`/maps/${id}`);
  }

  static async getMapWithBoats(id: number): Promise<MapWithBoats> {
    return apiClient.get<MapWithBoats>(`/maps/${id}`);
  }

  static async createMap(mapData: MapCreate): Promise<Map> {
    return apiClient.post<Map>('/maps', mapData);
  }

  static async updateMap(id: number, mapData: MapUpdate): Promise<Map> {
    return apiClient.put<Map>(`/maps/${id}`, mapData);
  }

  static async deleteMap(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/maps/${id}`);
  }
}

