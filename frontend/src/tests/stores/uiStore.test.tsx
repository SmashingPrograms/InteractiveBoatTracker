// frontend/src/tests/stores/uiStore.test.tsx
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useUIStore } from '../../stores/uiStore';

describe('useUIStore', () => {
  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.sidebarOpen).toBe(true);
    expect(result.current.selectedPositionId).toBeNull();
    expect(result.current.showBoatForm).toBe(false);
    expect(result.current.showMapForm).toBe(false);
    expect(result.current.currentPage).toBe('map');
  });

  it('toggles sidebar correctly', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.sidebarOpen).toBe(false);
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.sidebarOpen).toBe(true);
  });

  it('sets selected position', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSelectedPosition(123);
    });
    
    expect(result.current.selectedPositionId).toBe(123);
    
    act(() => {
      result.current.setSelectedPosition(null);
    });
    
    expect(result.current.selectedPositionId).toBeNull();
  });

  it('manages map form modal state', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.showMapFormModal();
    });
    
    expect(result.current.showMapForm).toBe(true);
    
    act(() => {
      result.current.hideMapFormModal();
    });
    
    expect(result.current.showMapForm).toBe(false);
  });

  it('manages page navigation', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setCurrentPage('maps');
    });
    
    expect(result.current.currentPage).toBe('maps');
    
    act(() => {
      result.current.setCurrentPage('map');
    });
    
    expect(result.current.currentPage).toBe('map');
  });

  it('manages confirm dialog', () => {
    const { result } = renderHook(() => useUIStore());
    
    const mockConfig = {
      title: 'Test Title',
      message: 'Test message',
      onConfirm: () => {},
      onCancel: () => {},
    };
    
    act(() => {
      result.current.showConfirm(mockConfig);
    });
    
    expect(result.current.showConfirmDialog).toBe(true);
    expect(result.current.confirmDialogConfig).toEqual(mockConfig);
    
    act(() => {
      result.current.hideConfirm();
    });
    
    expect(result.current.showConfirmDialog).toBe(false);
    expect(result.current.confirmDialogConfig).toBeNull();
  });

  it('clamps map zoom correctly', () => {
    const { result } = renderHook(() => useUIStore());
    
    // Test upper bound
    act(() => {
      result.current.setMapZoom(5);
    });
    
    expect(result.current.mapZoom).toBe(3);
    
    // Test lower bound
    act(() => {
      result.current.setMapZoom(0.05);
    });
    
    expect(result.current.mapZoom).toBe(0.1);
    
    // Test normal value
    act(() => {
      result.current.setMapZoom(1.5);
    });
    
    expect(result.current.mapZoom).toBe(1.5);
  });
});


