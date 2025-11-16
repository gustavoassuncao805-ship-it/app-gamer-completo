'use client';

import { useState, useEffect } from 'react';
import { getServerManager } from '@/lib/serverManager';
import { Server } from '@/types/server';
import { ArrowLeft, Users, Wifi, Copy, ExternalLink, Settings, MessageSquare, UserX, Ban, Play, Pause, RotateCw, Power } from 'lucide-react';

interface RoomViewProps {
  serverId: string;
  onBack: () => void;
}

export default function RoomView({ serverId, onBack }: RoomViewProps) {
  const [server, setServer] = useState<Server | null>(null);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [mostrarLogs, setMostrarLogs] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarServidor();
    const interval = setInterval(carregarServidor, 1000);
    return () => clearInterval(interval);
  }, [serverId]);

  const carregarServidor = () => {
    const manager = getServerManager();
    const srv = manager.getServidor(serverId);
    setServer(srv || null);
  };

  const copiarLink = () => {
    if (server?.linkEntrada) {
      navigator.clipboard.writeText(server.linkEntrada);
      alert('✅ Link copiado!');
    }
  };

  const copiarCodigo = () => {
    if (server?.codigoEntrada) {
      navigator.clipboard.writeText(server.codigoEntrada);
      alert('✅ Código copiado!');
    }
  };

  const abrirJogo = () => {
    if (!server) return;
    const manager = getServerManager();
    const sucesso = manager.abrirJogoDeepLink(server.jogo, server);
    
    if (!sucesso) {
      alert(`❌ ${server.jogo} não encontrado. Instale o jogo para continuar.`);
    }
  };

  const kickJogador = (jogadorId: string) => {
    const manager = getServerManager();
    const userId = `user_${Date.now()}`;
    manager.kickJogador(serverId, jogadorId, userId);
  };

  const banirJogador = (jogadorId: string) => {
    const manager = getServerManager();
    const userId = `user_${Date.now()}`;
    manager.banirJogador(serverId, jogadorId, userId);
  };

  const controlarServidor = (acao: 'pausar' | 'iniciar' | 'reiniciar' | 'finalizar') => {
    const manager = getServerManager();
    const userId = `user_${Date.now()}`;
    const sucesso = manager.controlarServidor(serverId, userId, acao);
    
    if (sucesso && acao === 'finalizar') {
      onBack();
    }
  };

  if (!server) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-xl">Servidor não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{server.nome}</h1>
              <div className="flex items-center gap-4 text-white/70">
                <span className="flex items-center gap-2">
                  <Wifi className={`w-5 h-5 ${server.status === 'online' ? 'text-green-400' : 'text-red-400'}`} />
                  {server.status === 'online' ? 'Online' : 'Offline'}
                </span>
                <span>🎮 {server.jogo}</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {server.jogadores.length}/{server.maxJogadores}
                </span>
                <span className={`font-semibold ${
                  (server.ping || 0) < 50 ? 'text-green-400' :
                  (server.ping || 0) < 100 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {server.ping || 0}ms
                </span>
              </div>
            </div>
            <button
              onClick={() => setMostrarAdmin(!mostrarAdmin)}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Servidor */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">📡 Informações de Conexão</h2>
              
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/70 text-sm mb-1">Endereço IP</p>
                  <p className="text-white font-mono font-bold">{server.ip}:{server.porta}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Link de Entrada</p>
                    <p className="text-white font-mono text-sm">{server.linkEntrada}</p>
                  </div>
                  <button
                    onClick={copiarLink}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Código de Entrada</p>
                    <p className="text-white font-mono font-bold text-2xl">{server.codigoEntrada}</p>
                  </div>
                  <button
                    onClick={copiarCodigo}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={abrirJogo}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-6 h-6" />
                Abrir {server.jogo} Diretamente
              </button>
            </div>

            {/* Chat */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Chat
              </h2>
              
              <div className="bg-white/5 rounded-xl p-4 h-64 overflow-y-auto mb-4">
                {server.logs
                  .filter(log => log.tipo === 'chat')
                  .map((log) => (
                    <div key={log.id} className="mb-2">
                      <span className="text-blue-400 font-semibold">{log.usuario}: </span>
                      <span className="text-white">{log.mensagem}</span>
                    </div>
                  ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Jogadores Online */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Jogadores ({server.jogadores.length}/{server.maxJogadores})
              </h2>
              
              <div className="space-y-2">
                {server.jogadores.length === 0 ? (
                  <p className="text-white/50 text-center py-4">Nenhum jogador online</p>
                ) : (
                  server.jogadores.map((jogador) => (
                    <div
                      key={jogador.id}
                      className="bg-white/5 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{jogador.avatar}</span>
                        <div>
                          <p className="text-white font-semibold">{jogador.nome}</p>
                          <p className="text-white/50 text-xs">
                            {new Date(jogador.entradaEm).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {mostrarAdmin && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => kickJogador(jogador.id)}
                            className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 p-2 rounded-lg transition-colors"
                            title="Expulsar"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => banirJogador(jogador.id)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-2 rounded-lg transition-colors"
                            title="Banir"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Controles Admin */}
            {mostrarAdmin && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">⚙️ Controles</h2>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => controlarServidor(server.status === 'online' ? 'pausar' : 'iniciar')}
                    className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 p-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {server.status === 'online' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {server.status === 'online' ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button
                    onClick={() => controlarServidor('reiniciar')}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 p-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-5 h-5" />
                    Reiniciar
                  </button>
                  <button
                    onClick={() => setMostrarLogs(!mostrarLogs)}
                    className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 p-3 rounded-xl transition-colors col-span-2"
                  >
                    {mostrarLogs ? 'Ocultar' : 'Mostrar'} Logs
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('⚠️ Tem certeza que deseja encerrar o servidor?')) {
                        controlarServidor('finalizar');
                      }
                    }}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-3 rounded-xl transition-colors flex items-center justify-center gap-2 col-span-2"
                  >
                    <Power className="w-5 h-5" />
                    Encerrar Servidor
                  </button>
                </div>
              </div>
            )}

            {/* Logs */}
            {mostrarLogs && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">📋 Logs do Sistema</h2>
                
                <div className="bg-white/5 rounded-xl p-4 h-96 overflow-y-auto">
                  {server.logs.map((log) => (
                    <div key={log.id} className="mb-2 text-sm">
                      <span className="text-white/50">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {' '}
                      <span className={`font-semibold ${
                        log.tipo === 'sistema' ? 'text-blue-400' :
                        log.tipo === 'entrada' ? 'text-green-400' :
                        log.tipo === 'saida' ? 'text-yellow-400' :
                        log.tipo === 'kick' ? 'text-orange-400' :
                        log.tipo === 'ban' ? 'text-red-400' : 'text-white'
                      }`}>
                        [{log.tipo.toUpperCase()}]
                      </span>
                      {' '}
                      <span className="text-white/80">{log.mensagem}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
