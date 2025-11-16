'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

type RankingType = 'global' | 'weekly' | 'category';

export default function Rankings() {
  const [rankingType, setRankingType] = useState<RankingType>('global');
  const { rankings, updateRankings } = useGame();

  useEffect(() => {
    updateRankings();
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-purple-500 to-pink-600';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Rankings
          </h2>
          <p className="text-gray-400 mt-1">Veja os melhores jogadores da plataforma</p>
        </div>
      </div>

      {/* Ranking Type Selector */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setRankingType('global')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            rankingType === 'global'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Trophy className="w-5 h-5" />
          Global
        </button>
        <button
          onClick={() => setRankingType('weekly')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            rankingType === 'weekly'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Calendar className="w-5 h-5" />
          Semanal
        </button>
        <button
          onClick={() => setRankingType('category')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            rankingType === 'category'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          Por Categoria
        </button>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.map((entry, index) => (
          <div
            key={entry.playerId}
            className={`group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 hover:border-cyan-500/50 p-6 transition-all duration-300 hover:scale-102 hover:shadow-xl ${
              index < 3 ? 'hover:shadow-yellow-500/30' : 'hover:shadow-purple-500/30'
            }`}
          >
            <div className="flex items-center gap-6">
              {/* Rank */}
              <div className={`w-16 h-16 bg-gradient-to-br ${getRankColor(entry.rank)} rounded-full flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                {getRankIcon(entry.rank)}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{entry.playerAvatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {entry.playerName}
                    </h3>
                    <p className="text-gray-400 text-sm">Nível {entry.level}</p>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">pontos</p>
              </div>

              {/* Rank Number */}
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  #{entry.rank}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rankings.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-gray-400 mb-2">Nenhum ranking disponível</h3>
          <p className="text-gray-500">Continue jogando para aparecer aqui!</p>
        </div>
      )}
    </div>
  );
}
