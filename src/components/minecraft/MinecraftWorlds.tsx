'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, Lock, Unlock, Plus, Play, AlertCircle } from 'lucide-react';

interface World {
  id: string;
  nome: string;
  descricao: string;
  ip_servidor: string;
  porta_servidor: number;
  tipo: 'publico' | 'privado';
  senha?: string;
  criador: string;
}

interface MinecraftWorldsProps {
  onBack: () => void;
  onCreateWorld: () => void;
}

export default function MinecraftWorlds({ onBack, onCreateWorld }: MinecraftWorldsProps) {
  const { currentPlayer } = useGame();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorlds();
  }, []);

  const loadWorlds = () => {
    const savedWorlds = localStorage.getItem('mundos_minecraft');
    if (savedWorlds) {
      setWorlds(JSON.parse(savedWorlds));
    }
  };

  const handleEnterWorld = (world: World) => {
    if (world.tipo === 'privado') {
      setSelectedWorld(world);
      setShowPasswordModal(true);
      setPasswordInput('');
      setError('');
    } else {
      openMinecraft(world);
    }
  };

  const handlePasswordSubmit = () => {
    if (!selectedWorld) return;

    if (passwordInput === selectedWorld.senha) {
      setShowPasswordModal(false);
      openMinecraft(selectedWorld);
    } else {
      setError('❌ Senha incorreta! Tente novamente.');
    }
  };

  const openMinecraft = (world: World) => {
    const deepLink = `minecraft://?addExternalServer=${encodeURIComponent(world.nome)}|${world.ip_servidor}:${world.porta_servidor}`;
    
    // Tentar abrir o Minecraft
    const link = document.createElement('a');
    link.href = deepLink;
    link.click();

    // Verificar se o Minecraft foi aberto (timeout de 2 segundos)
    setTimeout(() => {
      if (document.hidden) {
        // Minecraft provavelmente foi aberto
        console.log('Minecraft aberto com sucesso');
      } else {
        // Minecraft não foi aberto
        alert('⚠️ Minecraft não encontrado. Instale o jogo para continuar.');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Mundos de Minecraft
                </h1>
                <p className="text-gray-400 text-sm">
                  {worlds.length} {worlds.length === 1 ? 'mundo disponível' : 'mundos disponíveis'}
                </p>
              </div>
            </div>

            <button
              onClick={onCreateWorld}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Criar Mundo</span>
            </button>
          </div>
        </div>

        {/* Lista de Mundos */}
        {worlds.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum mundo disponível</h3>
            <p className="text-gray-400 mb-6">Seja o primeiro a criar um mundo!</p>
            <button
              onClick={onCreateWorld}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Mundo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worlds.map((world) => (
              <div
                key={world.id}
                className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all duration-300 shadow-xl"
              >
                {/* Tipo do Mundo */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                    world.tipo === 'privado'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {world.tipo === 'privado' ? (
                      <>
                        <Lock className="w-3 h-3" />
                        Privado
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3" />
                        Público
                      </>
                    )}
                  </div>
                  <span className="text-2xl">🌍</span>
                </div>

                {/* Nome do Mundo */}
                <h3 className="text-xl font-bold text-white mb-2">{world.nome}</h3>
                
                {/* Descrição */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{world.descricao}</p>

                {/* Servidor Info */}
                <div className="bg-black/30 rounded-lg p-3 mb-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">IP:</span>
                    <span className="text-gray-300 font-mono">{world.ip_servidor}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Porta:</span>
                    <span className="text-gray-300 font-mono">{world.porta_servidor}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Criador:</span>
                    <span className="text-gray-300">{world.criador}</span>
                  </div>
                </div>

                {/* Botão Entrar */}
                <button
                  onClick={() => handleEnterWorld(world)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30"
                >
                  <Play className="w-5 h-5" />
                  Entrar no Minecraft
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Senha */}
      {showPasswordModal && selectedWorld && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mundo Privado</h3>
                <p className="text-sm text-gray-400">{selectedWorld.nome}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              Este mundo é privado. Digite a senha para entrar:
            </p>

            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Digite a senha"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-4"
              autoFocus
            />

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setSelectedWorld(null);
                  setError('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
