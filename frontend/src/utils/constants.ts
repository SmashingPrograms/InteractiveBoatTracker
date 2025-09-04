// frontend/src/utils/constants.ts
export const BOAT_COLORS = [
  'blue', 'red', 'green', 'yellow', 'orange', 
  'purple', 'pink', 'brown', 'gray', 'navy',
  'teal', 'lime', 'maroon', 'olive'
] as const;

export const BOAT_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export const MAP_DEFAULTS = {
  BOAT_WIDTH: 100,
  BOAT_HEIGHT: 50,
  BOAT_COLOR: 'blue',
  STROKE_COLOR: 'black',
  STROKE_WIDTH: 1,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

