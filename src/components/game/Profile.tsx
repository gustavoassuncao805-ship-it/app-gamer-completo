'use client';

import { useState } from 'react';
import { Edit, Award, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { ACHIEVEMENTS_LIST, XP_PER_LEVEL } from '@/lib/constants';

export default function Profile() {
  const { currentPlayer } = useGame();
  const [isEditing, setIsEditing] = useState(false);

  if (!currentPlayer) return null;

  const xpProgress = (currentPlayer.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
  const xpCurrent = currentPlayer.xp % XP_PER_LEVEL;
  const xpNeeded = XP_PER_LEVEL;

  // Simular estatísticas
  const stats = {
    worldsVisited: 12,
    quickMatches: 8,
    messagesSent: 156,
    hoursPlayed: 24,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Meu Perfil
        </h2>
        <p className="text-gray-400 mt-1">Veja suas estatísticas e conquistas</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-purple-500/30 p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-6xl shadow-2xl shadow-purple-500/50">
              {currentPlayer.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full px-4 py-2 shadow-lg">
              <span className="text-white font-bold">Nv {currentPlayer.level}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                <h3 className="text-3xl font-bold text-white">{currentPlayer.name}</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-300" />
                </button>
              </div>
              <p className="text-gray-400">{currentPlayer.bio}</p>
            </div>

            {/* Rank Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-6 py-3 rounded-full">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-bold text-lg">{currentPlayer.rank}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-yellow-400 font-bold text-xl">{currentPlayer.coins}</p>
                    <p className="text-gray-400 text-xs">Moedas</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-cyan-400 font-bold text-xl">{currentPlayer.achievements.length}</p>
                    <p className="text-gray-400 text-xs">Conquistas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progresso para Nível {currentPlayer.level + 1}</span>
            <span className="text-cyan-400 font-bold">
              {xpCurrent.toLocaleString()} / {xpNeeded.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.worldsVisited}</p>
              <p className="text-gray-400 text-sm">Mundos Visitados</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.quickMatches}</p>
              <p className="text-gray-400 text-sm">Partidas Rápidas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.messagesSent}</p>
              <p className="text-gray-400 text-sm">Mensagens Enviadas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.hoursPlayed}h</p>
              <p className="text-gray-400 text-sm">Tempo Jogado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Conquistas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS_LIST.map((achievement) => {
            const unlocked = currentPlayer.achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                    : 'bg-gray-800/50 border-gray-700 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm mb-1">{achievement.name}</h4>
                    <p className="text-gray-400 text-xs line-clamp-2">{achievement.description}</p>
                    {unlocked && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                        <span className="text-yellow-400 text-xs font-bold">✓ Desbloqueado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
