// frontend/src/stores/uiStore.ts (Updated with map form state)
import { create } from 'zustand';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarWidth: number;
  
  // Map canvas
  selectedPositionId: number | null;
  isMapInteractive: boolean;
  mapZoom: number;
  
  // Modals
  showBoatForm: boolean;
  showMapForm: boolean;
  showConfirmDialog: boolean;
  confirmDialogConfig: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null;
  
  // Loading states
  globalLoading: boolean;
  
  // Navigation
  currentPage: 'map' | 'maps';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedPosition: (positionId: number | null) => void;
  setMapInteractive: (interactive: boolean) => void;
  setMapZoom: (zoom: number) => void;
  showBoatFormModal: () => void;
  hideBoatFormModal: () => void;
  showMapFormModal: () => void;
  hideMapFormModal: () => void;
  showConfirm: (config: UIState['confirmDialogConfig']) => void;
  hideConfirm: () => void;
  setGlobalLoading: (loading: boolean) => void;
  setCurrentPage: (page: 'map' | 'maps') => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  sidebarOpen: true,
  sidebarWidth: 400,
  selectedPositionId: null,
  isMapInteractive: true,
  mapZoom: 1,
  showBoatForm: false,
  showMapForm: false,
  showConfirmDialog: false,
  confirmDialogConfig: null,
  globalLoading: false,
  currentPage: 'map',

  // Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  setSelectedPosition: (positionId: number | null) => {
    set({ selectedPositionId: positionId });
  },

  setMapInteractive: (interactive: boolean) => {
    set({ isMapInteractive: interactive });
  },

  setMapZoom: (zoom: number) => {
    set({ mapZoom: Math.max(0.1, Math.min(3, zoom)) }); // Clamp between 0.1 and 3
  },

  showBoatFormModal: () => {
    set({ showBoatForm: true });
  },

  hideBoatFormModal: () => {
    set({ showBoatForm: false });
  },

  showMapFormModal: () => {
    set({ showMapForm: true });
  },

  hideMapFormModal: () => {
    set({ showMapForm: false });
  },

  showConfirm: (config) => {
    set({ 
      showConfirmDialog: true, 
      confirmDialogConfig: config 
    });
  },

  hideConfirm: () => {
    set({ 
      showConfirmDialog: false, 
      confirmDialogConfig: null 
    });
  },

  setGlobalLoading: (loading: boolean) => {
    set({ globalLoading: loading });
  },

  setCurrentPage: (page: 'map' | 'maps') => {
    set({ currentPage: page });
  },
}));