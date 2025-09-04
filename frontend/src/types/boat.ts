// frontend/src/types/boat.ts
export interface BoatListing {
  id: number;
  index: number;
  name?: string;
  customer_name: string;
  size?: string;
  make_model?: string;
  vehicle_type?: string;
  section?: string;
  notes?: string;
  is_mapped: boolean;
  position_id?: number;
  created_at: string;
  updated_at?: string;
}

export interface BoatListingCreate {
  index: number;
  name?: string;
  customer_name: string;
  size?: string;
  make_model?: string;
  vehicle_type?: string;
  section?: string;
  notes?: string;
}

export interface BoatListingUpdate {
  index?: number;
  name?: string;
  customer_name?: string;
  size?: string;
  make_model?: string;
  vehicle_type?: string;
  section?: string;
  notes?: string;
}

export interface BoatPosition {
  id: number;
  map_id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  stroke_color: string;
  stroke_width: number;
  is_visible: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BoatPositionCreate {
  map_id: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
  stroke_color?: string;
  stroke_width?: number;
  is_visible?: boolean;
}

export interface BoatPositionUpdate {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
  stroke_color?: string;
  stroke_width?: number;
  is_visible?: boolean;
}

export interface BoatWithPosition {
  boat?: BoatListing;
  position: BoatPosition;
}

export interface BoatSearchParams extends SearchParams {
  mapped_only?: boolean;
  section?: string;
}

