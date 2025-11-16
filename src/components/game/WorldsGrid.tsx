'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Play, Users, Trophy, Zap, Gamepad2 } from 'lucide-react';

interface WorldsGridProps {
  onMinecraftClick?: () => void;
}

export default function WorldsGrid({ onMinecraftClick }: WorldsGridProps) {
  const { worlds, joinWorld } = useGame();
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  const handleJoinWorld = (worldId: string) => {
    joinWorld(worldId);
    setSelectedWorld(worldId);
  };

  const games = [
    {
      id: 'minecraft',
      name: 'Minecraft',
      emoji: '🎮',
      description: 'Entre em mundos de Minecraft',
      gradient: 'from-green-500 to-emerald-600',
      players: '1.2M online',
      action: onMinecraftClick
    },
    {
      id: 'ludo',
      name: 'Ludo',
      emoji: '🎲',
      description: 'Jogo de tabuleiro clássico',
      gradient: 'from-blue-500 to-cyan-600',
      players: '850K online'
    },
    {
      id: 'truco',
      name: 'Truco',
      emoji: '🃏',
      description: 'Cartas brasileiras',
      gradient: 'from-red-500 to-pink-600',
      players: '620K online'
    },
    {
      id: 'uno',
      name: 'UNO',
      emoji: '🎴',
      description: 'Descarte todas as cartas',
      gradient: 'from-yellow-500 to-orange-600',
      players: '1.5M online'
    },
    {
      id: 'chess',
      name: 'Xadrez',
      emoji: '♟️',
      description: 'Estratégia clássica',
      gradient: 'from-purple-500 to-indigo-600',
      players: '420K online'
    },
    {
      id: 'pool',
      name: 'Sinuca',
      emoji: '🎱',
      description: 'Bilhar online',
      gradient: 'from-teal-500 to-green-600',
      players: '380K online'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Escolha seu Jogo
        </h2>
        <p className="text-gray-400">
          Milhões de jogadores online agora
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={game.action || (() => handleJoinWorld(game.id))}
            className="group bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-left"
          >
            {/* Game Icon */}
            <div className={`w-16 h-16 bg-gradient-to-br ${game.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <span className="text-3xl">{game.emoji}</span>
            </div>

            {/* Game Info */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {game.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {game.description}
            </p>

            {/* Players Online */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-4 h-4" />
                <span>{game.players}</span>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Online
              </div>
            </div>

            {/* Play Button Overlay */}
            <div className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-5 h-5" />
              Jogar Agora
            </div>
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span className="text-3xl font-bold text-white">5.2M</span>
          </div>
          <p className="text-gray-400 text-sm">Jogadores Online</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-purple-400" />
            <span className="text-3xl font-bold text-white">12K</span>
          </div>
          <p className="text-gray-400 text-sm">Torneios Ativos</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-3xl font-bold text-white">850</span>
          </div>
          <p className="text-gray-400 text-sm">Partidas/Segundo</p>
        </div>
      </div>
    </div>
  );
}
