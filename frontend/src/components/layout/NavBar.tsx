// frontend/src/components/layout/Navbar.tsx (Updated with maps navigation)
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMaps } from '../../hooks/useMaps';
import { useMapStore } from '../../stores/mapStore';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: maps = [] } = useMaps();
  const { selectedMapId, setCurrentMap } = useMapStore();
  const { toggleSidebar, currentPage, setCurrentPage } = useUIStore();

  const currentMap = maps.find(map => map.id === selectedMapId);

  const handleMapSelect = (mapId: number) => {
    setCurrentMap(mapId);
    if (currentPage === 'maps') {
      setCurrentPage('map');
    }
  };

  const handleViewMaps = () => {
    setCurrentPage('maps');
  };

  return (
    <nav className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Pier 11 Marina {currentPage === 'maps' ? 'Maps' : 'Interactive Map'}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Current Map & Navigation */}
        {currentPage === 'map' && currentMap && (
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentMap.name}</span>
              <span className="ml-2">({currentMap.boat_count} boats)</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewMaps}
            >
              See Other Maps
            </Button>
          </div>
        )}
        
        {/* Map Selector for Maps Page */}
        {currentPage === 'maps' && currentMap && (
          <div className="text-sm text-gray-600">
            Current: <span className="font-medium">{currentMap.name}</span>
          </div>
        )}
        
        {/* Quick Map Selector Dropdown */}
        {currentPage === 'map' && maps.length > 1 && (
          <div className="flex items-center space-x-2">
            <select
              value={selectedMapId || ''}
              onChange={(e) => handleMapSelect(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select map...</option>
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* User Menu */}
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600">
            {user?.full_name} ({user?.role})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};