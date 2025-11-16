'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Zap, Loader2, MessageCircle } from 'lucide-react';
import ChatBox from './ChatBox';

export default function QuickMatch() {
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  const { addXP } = useGame();

  const handleQuickMatch = () => {
    setIsSearching(true);
    
    // Simular busca de jogador (2-4 segundos)
    const searchTime = Math.random() * 2000 + 2000;
    
    setTimeout(() => {
      const opponents = [
        { name: 'ShadowKiller', avatar: '⚔️', level: 15 },
        { name: 'FireStorm99', avatar: '🔥', level: 12 },
        { name: 'NinjaGamer', avatar: '🥷', level: 18 },
        { name: 'ProPlayer123', avatar: '👑', level: 20 },
        { name: 'MasterChief', avatar: '🎯', level: 14 },
      ];
      
      const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
      setOpponent(randomOpponent);
      setIsSearching(false);
      setMatchFound(true);
      addXP(100); // XP por partida rápida
    }, searchTime);
  };

  const handleLeaveMatch = () => {
    setMatchFound(false);
    setOpponent(null);
  };

  if (matchFound && opponent) {
    return (
      <div className="space-y-6">
        {/* Match Header */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-4xl animate-bounce">⚡</div>
            <h2 className="text-3xl font-bold text-green-400">Partida Encontrada!</h2>
            <div className="text-4xl animate-bounce">⚡</div>
          </div>
          
          {/* Players */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg shadow-cyan-500/50">
                🎮
              </div>
              <p className="text-white font-bold">Você</p>
            </div>
            
            <div className="text-5xl text-purple-500 animate-pulse">VS</div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg shadow-purple-500/50">
                {opponent.avatar}
              </div>
              <p className="text-white font-bold">{opponent.name}</p>
              <p className="text-gray-400 text-sm">Nível {opponent.level}</p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Chat da Partida</h3>
          </div>
          <ChatBox roomId="quickmatch" />
        </div>

        {/* Leave Button */}
        <button
          onClick={handleLeaveMatch}
          className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30"
        >
          Sair da Partida
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Partida Rápida
          </h2>
          <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-gray-400 text-lg">
          Encontre um oponente instantaneamente e comece a jogar!
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-purple-500/30 p-8 sm:p-12 shadow-2xl">
        {!isSearching ? (
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">
                Pronto para a ação?
              </h3>
              <p className="text-gray-400">
                Clique no botão abaixo e encontraremos um jogador para você em segundos!
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-xl p-4 border border-cyan-500/20">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-cyan-400 font-bold">Instantâneo</p>
                <p className="text-gray-500 text-xs mt-1">Encontre em segundos</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                <div className="text-3xl mb-2">🎮</div>
                <p className="text-purple-400 font-bold">Automático</p>
                <p className="text-gray-500 text-xs mt-1">Sem convites</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-pink-500/20">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-pink-400 font-bold">Chat Integrado</p>
                <p className="text-gray-500 text-xs mt-1">Converse em tempo real</p>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleQuickMatch}
              className="w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 hover:scale-105"
            >
              🎮 Jogar Agora
            </button>
          </div>
        ) : (
          <div className="text-center space-y-8 py-8">
            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                  <Loader2 className="w-16 h-16 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full animate-ping opacity-20" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white animate-pulse">
                Procurando jogador...
              </h3>
              <p className="text-gray-400">
                Aguarde enquanto encontramos o oponente perfeito para você!
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <p className="text-cyan-400 font-bold">+100 XP</p>
              <p className="text-gray-400 text-sm">Por partida completa</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <p className="text-purple-400 font-bold">Sem Espera</p>
              <p className="text-gray-400 text-sm">Matchmaking rápido</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
