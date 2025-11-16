'use client';

import { useState, useEffect } from 'react';
import { getServerManager } from '@/lib/serverManager';
import { Server } from '@/types/server';
import { Users, Globe, Lock, Wifi, WifiOff, Plus, Search, Gamepad2 } from 'lucide-react';

interface ServerListProps {
  onJoinServer: (serverId: string) => void;
  onCreateServer: () => void;
}

export default function ServerList({ onJoinServer, onCreateServer }: ServerListProps) {
  const [servers, setServers] = useState<Server[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'publicos' | 'privados'>('todos');
  const [busca, setBusca] = useState('');
  const [codigoEntrada, setCodigoEntrada] = useState('');

  useEffect(() => {
    carregarServidores();
    const interval = setInterval(carregarServidores, 2000);
    return () => clearInterval(interval);
  }, [filtro]);

  const carregarServidores = () => {
    const manager = getServerManager();
    let lista: Server[] = [];

    if (filtro === 'publicos') {
      lista = manager.listarServidoresPublicos();
    } else if (filtro === 'privados') {
      lista = manager.listarServidoresPrivados();
    } else {
      lista = manager.listarServidores();
    }

    // Filtrar por busca
    if (busca) {
      lista = lista.filter(s => 
        s.nome.toLowerCase().includes(busca.toLowerCase()) ||
        s.jogo.toLowerCase().includes(busca.toLowerCase())
      );
    }

    setServers(lista);
  };

  const entrarPorCodigo = () => {
    if (!codigoEntrada.trim()) return;

    const manager = getServerManager();
    const jogador = {
      id: `user_${Date.now()}`,
      nome: 'Jogador',
      avatar: '👤'
    };

    const sucesso = manager.entrarServidorPorId(codigoEntrada, jogador);
    if (sucesso) {
      const server = manager.listarServidores().find(s => 
        s.id === codigoEntrada || s.codigoEntrada === codigoEntrada
      );
      if (server) {
        onJoinServer(server.id);
      }
    } else {
      alert('❌ Servidor não encontrado ou cheio!');
    }
  };

  const matchmaking = () => {
    const manager = getServerManager();
    const server = manager.encontrarSalaDisponivel('Minecraft');
    
    if (server) {
      const jogador = {
        id: `user_${Date.now()}`,
        nome: 'Jogador',
        avatar: '👤'
      };
      manager.entrarServidor(server.id, jogador);
      onJoinServer(server.id);
    } else {
      alert('❌ Nenhum servidor disponível no momento!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🎮 Servidores Online</h1>
              <p className="text-white/70">Sistema automático de servidores externos</p>
            </div>
            <button
              onClick={onCreateServer}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Servidor
            </button>
          </div>

          {/* Busca e Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar servidor..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFiltro('todos')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filtro === 'todos'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltro('publicos')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filtro === 'publicos'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-1" />
                Públicos
              </button>
              <button
                onClick={() => setFiltro('privados')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  filtro === 'privados'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Lock className="w-4 h-4 inline mr-1" />
                Privados
              </button>
            </div>
          </div>

          {/* Entrar por Código */}
          <div className="flex gap-2">
            <input
              type="text"
              value={codigoEntrada}
              onChange={(e) => setCodigoEntrada(e.target.value)}
              placeholder="Digite o código do servidor (6 dígitos)"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={6}
            />
            <button
              onClick={entrarPorCodigo}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Entrar
            </button>
            <button
              onClick={matchmaking}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Matchmaking
            </button>
          </div>
        </div>

        {/* Lista de Servidores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.length === 0 ? (
            <div className="col-span-full bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-white/20">
              <p className="text-white/70 text-lg">Nenhum servidor encontrado</p>
              <p className="text-white/50 mt-2">Crie o primeiro servidor!</p>
            </div>
          ) : (
            servers.map((server) => (
              <div
                key={server.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => onJoinServer(server.id)}
              >
                {/* Status e Tipo */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {server.status === 'online' ? (
                      <Wifi className="w-5 h-5 text-green-400" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-sm font-semibold ${
                      server.status === 'online' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {server.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {server.tipo === 'publico' ? (
                      <Globe className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-orange-400" />
                    )}
                    <span className={`text-xs font-semibold ${
                      server.tipo === 'publico' ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      {server.tipo === 'publico' ? 'Público' : 'Privado'}
                    </span>
                  </div>
                </div>

                {/* Nome e Jogo */}
                <h3 className="text-white font-bold text-lg mb-2 truncate">{server.nome}</h3>
                <p className="text-white/70 text-sm mb-4">🎮 {server.jogo}</p>

                {/* Informações */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Jogadores:</span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {server.jogadores.length}/{server.maxJogadores}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Ping:</span>
                    <span className={`font-semibold ${
                      (server.ping || 0) < 50 ? 'text-green-400' :
                      (server.ping || 0) < 100 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {server.ping || 0}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Código:</span>
                    <span className="text-white font-mono font-bold">{server.codigoEntrada}</span>
                  </div>
                </div>

                {/* Botão Entrar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoinServer(server.id);
                  }}
                  disabled={server.jogadores.length >= server.maxJogadores || server.status !== 'online'}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    server.jogadores.length >= server.maxJogadores || server.status !== 'online'
                      ? 'bg-gray-500/50 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105'
                  }`}
                >
                  {server.jogadores.length >= server.maxJogadores ? 'Cheio' : 
                   server.status !== 'online' ? 'Offline' : 'Entrar'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
