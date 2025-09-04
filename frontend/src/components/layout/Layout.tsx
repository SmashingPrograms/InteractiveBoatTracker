// frontend/src/components/layout/Layout.tsx
import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useMapStore } from '../../stores/mapStore';
import { useMaps } from '../../hooks/useMaps';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: maps = [] } = useMaps();
  const { selectedMapId, setCurrentMap } = useMapStore();

  // Auto-select first map if none selected
  useEffect(() => {
    if (maps.length > 0 && !selectedMapId) {
      setCurrentMap(maps[0].id);
    }
  }, [maps, selectedMapId, setCurrentMap]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};