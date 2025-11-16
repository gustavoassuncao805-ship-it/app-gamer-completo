'use client';

import { useState } from 'react';
import { Users, MessageCircle } from 'lucide-react';
import { GAME_CATEGORIES } from '@/lib/constants';
import { useGame } from '@/contexts/GameContext';
import ChatBox from './ChatBox';

export default function PublicRooms() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addXP } = useGame();

  const rooms = GAME_CATEGORIES.map(cat => ({
    ...cat,
    players: Math.floor(Math.random() * 30) + 5,
    maxPlayers: 50,
  }));

  const handleJoinRoom = (categoryId: string) => {
    setSelectedCategory(categoryId);
    addXP(50);
  };

  const handleLeaveRoom = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    const room = rooms.find(r => r.id === selectedCategory);
    
    return (
      <div className="space-y-6">
        {/* Room Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{room?.icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-white">{room?.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold">
                    {room?.players}/{room?.maxPlayers} jogadores
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300"
            >
              Sair da Sala
            </button>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Chat da Sala</h3>
          </div>
          <ChatBox roomId={selectedCategory} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Salas Públicas
        </h2>
        <p className="text-gray-400 mt-1">Entre em salas por categoria e converse com outros jogadores</p>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 hover:border-cyan-500/50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
          >
            {/* Icon */}
            <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
              {room.icon}
            </div>

            {/* Info */}
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {room.name}
              </h3>

              {/* Players */}
              <div className="flex items-center justify-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-500/30">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-bold text-sm">
                  {room.players}/{room.maxPlayers}
                </span>
              </div>

              {/* Join Button */}
              <button
                onClick={() => handleJoinRoom(room.id)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
              >
                Entrar na Sala
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
