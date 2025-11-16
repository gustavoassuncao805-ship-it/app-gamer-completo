'use client';

import { useState, useEffect } from 'react';
import { Shield, UserX, Ban, Edit, Lock, Unlock, Users, RotateCcw, Power, Play, Pause, XCircle, FileText } from 'lucide-react';
import { getServerManager } from '@/lib/serverManager';
import { Server } from '@/types/server';
import { useGame } from '@/contexts/GameContext';

interface AdminControlsProps {
  serverId: string;
  onClose: () => void;
}

export default function AdminControls({ serverId, onClose }: AdminControlsProps) {
  const { currentPlayer } = useGame();
  const [server, setServer] = useState<Server | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoMaxJogadores, setNovoMaxJogadores] = useState(10);

  useEffect(() => {
    loadServer();
    const interval = setInterval(loadServer, 1000);
    return () => clearInterval(interval);
  }, [serverId]);

  const loadServer = () => {
    const manager = getServerManager();
    const srv = manager.getServidor(serverId);
    if (srv) {
      setServer(srv);
      if (!novoNome) setNovoNome(srv.nome);
      if (!novoMaxJogadores) setNovoMaxJogadores(srv.maxJogadores);
    }
  };

  const handleKick = (jogadorId: string) => {
    if (!confirm('Expulsar este jogador?')) return;
    
    const manager = getServerManager();
    manager.kickJogador(serverId, jogadorId, currentPlayer?.name || '');
    loadServer();
  };

  const handleBan = (jogadorId: string) => {
    if (!confirm('Banir este jogador permanentemente?')) return;
    
    const manager = getServerManager();
    manager.banirJogador(serverId, jogadorId, currentPlayer?.name || '');
    loadServer();
  };

  const handleSaveChanges = () => {
    const manager = getServerManager();
    manager.atualizarServidor(serverId, currentPlayer?.name || '', {
      nome: novoNome,
      maxJogadores: novoMaxJogadores
    });
    setEditMode(false);
    loadServer();
  };

  const handleToggleTipo = () => {
    if (!server) return;
    const manager = getServerManager();
    manager.atualizarServidor(serverId, currentPlayer?.name || '', {
      tipo: server.tipo === 'publico' ? 'privado' : 'publico'
    });
    loadServer();
  };

  const handleServerControl = (acao: 'pausar' | 'iniciar' | 'reiniciar' | 'finalizar') => {
    if (acao === 'finalizar' && !confirm('Finalizar servidor permanentemente?')) return;
    
    const manager = getServerManager();
    manager.controlarServidor(serverId, currentPlayer?.name || '', acao);
    
    if (acao === 'finalizar') {
      onClose();
    } else {
      loadServer();
    }
  };

  if (!server) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Painel Administrativo</h2>
            <p className="text-sm text-gray-400">Gerencie seu servidor</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Logs</span>
        </button>
      </div>

      {/* Logs */}
      {showLogs && (
        <div className="mb-6 bg-black/30 rounded-lg p-4 max-h-60 overflow-y-auto">
          <h3 className="text-sm font-bold text-white mb-3">📋 Histórico de Ações</h3>
          <div className="space-y-2">
            {server.logs.slice(-20).reverse().map((log) => (
              <div key={log.id} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-gray-600">
                  {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex-1">{log.mensagem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controles do Servidor */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">⚙️ Controles do Servidor</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleServerControl(server.status === 'online' ? 'pausar' : 'iniciar')}
              className="w-full flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300"
            >
              {server.status === 'online' ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pausar Servidor
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Iniciar Servidor
                </>
              )}
            </button>
            <button
              onClick={() => handleServerControl('reiniciar')}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar Servidor
            </button>
            <button
              onClick={() => handleServerControl('finalizar')}
              className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300"
            >
              <XCircle className="w-4 h-4" />
              Finalizar Servidor
            </button>
          </div>
        </div>

        {/* Configurações */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">🔧 Configurações</h3>
          
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome do Servidor</label>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Máx. Jogadores: {novoMaxJogadores}</label>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={novoMaxJogadores}
                  onChange={(e) => setNovoMaxJogadores(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setEditMode(true)}
                className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300"
              >
                <Edit className="w-4 h-4" />
                Editar Servidor
              </button>
              <button
                onClick={handleToggleTipo}
                className="w-full flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300"
              >
                {server.tipo === 'publico' ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Tornar Privado
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Tornar Público
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gerenciar Jogadores */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-white mb-3">👥 Gerenciar Jogadores</h3>
        <div className="space-y-2">
          {server.jogadores
            .filter(j => j.nome !== server.criador)
            .map((jogador) => (
              <div
                key={jogador.id}
                className="flex items-center justify-between bg-black/30 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span>{jogador.avatar}</span>
                  </div>
                  <span className="text-white font-medium text-sm">{jogador.nome}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleKick(jogador.id)}
                    className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-3 py-1 rounded text-xs transition-all duration-300"
                  >
                    <UserX className="w-3 h-3" />
                    Kick
                  </button>
                  <button
                    onClick={() => handleBan(jogador.id)}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded text-xs transition-all duration-300"
                  >
                    <Ban className="w-3 h-3" />
                    Ban
                  </button>
                </div>
              </div>
            ))}
          
          {server.jogadores.filter(j => j.nome !== server.criador).length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Nenhum jogador para gerenciar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
