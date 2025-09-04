// frontend/src/types/map.ts
export interface Map {
  id: number;
  name: string;
  description?: string;
  image_path: string;
  image_width: number;
  image_height: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  boat_count?: number;
}

export interface MapCreate {
  name: string;
  description?: string;
  image_path: string;
  image_width?: number;
  image_height?: number;
  is_active?: boolean;
}

export interface MapUpdate {
  name?: string;
  description?: string;
  image_path?: string;
  image_width?: number;
  image_height?: number;
  is_active?: boolean;
}

export interface MapWithBoats {
  map: Map;
  boats: BoatWithPosition[];
}

