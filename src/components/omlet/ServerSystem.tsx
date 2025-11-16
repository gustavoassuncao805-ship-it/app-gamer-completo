'use client';

import { useState } from 'react';
import ServerList from './ServerList';
import CreateServer from './CreateServer';
import RoomView from './RoomView';

type View = 'list' | 'create' | 'room';

export default function ServerSystem() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  const handleJoinServer = (serverId: string) => {
    setSelectedServerId(serverId);
    setCurrentView('room');
  };

  const handleServerCreated = (serverId: string) => {
    setSelectedServerId(serverId);
    setCurrentView('room');
  };

  const handleBackToList = () => {
    setSelectedServerId(null);
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'list' && (
        <ServerList
          onJoinServer={handleJoinServer}
          onCreateServer={() => setCurrentView('create')}
        />
      )}

      {currentView === 'create' && (
        <CreateServer
          onBack={handleBackToList}
          onServerCreated={handleServerCreated}
        />
      )}

      {currentView === 'room' && selectedServerId && (
        <RoomView
          serverId={selectedServerId}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}
