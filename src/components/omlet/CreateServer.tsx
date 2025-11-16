'use client';

import { useState } from 'react';
import { getServerManager } from '@/lib/serverManager';
import { ArrowLeft, Globe, Lock, Users, Gamepad2 } from 'lucide-react';

interface CreateServerProps {
  onBack: () => void;
  onServerCreated: (serverId: string) => void;
}

export default function CreateServer({ onBack, onServerCreated }: CreateServerProps) {
  const [tipo, setTipo] = useState<'publico' | 'privado'>('publico');
  const [jogo, setJogo] = useState('Minecraft');
  const [maxJogadores, setMaxJogadores] = useState(10);
  const [criando, setCriando] = useState(false);

  const jogosDisponiveis = [
    'Minecraft',
    'Roblox',
    'Free Fire',
    'PUBG',
    'Among Us',
    'Fortnite',
    'Call of Duty Mobile',
    'Brawl Stars'
  ];

  const criarServidor = () => {
    setCriando(true);

    const manager = getServerManager();
    const userId = `user_${Date.now()}`;

    // Verificar permissão para servidor privado
    if (tipo === 'privado') {
      const temPermissao = manager.verificarPermissaoServidorPrivado(userId);
      if (!temPermissao) {
        alert('❌ Você precisa pagar R$ 4,99 para criar servidores privados!\n\nVá em "Criar Mundo Privado" no menu para realizar o pagamento.');
        setCriando(false);
        return;
      }
    }

    // Criar servidor AUTOMATICAMENTE
    const server = manager.criarServidorAutomatico(
      userId,
      jogo,
      tipo,
      maxJogadores,
      true
    );

    if (server) {
      // Entrar automaticamente no servidor criado
      const jogador = {
        id: userId,
        nome: 'Criador',
        avatar: '👑'
      };
      manager.entrarServidor(server.id, jogador);

      setTimeout(() => {
        setCriando(false);
        onServerCreated(server.id);
      }, 1500);
    } else {
      alert('❌ Erro ao criar servidor!');
      setCriando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">🚀 Criar Servidor</h1>
          <p className="text-white/70">Sistema automático - tudo é gerado automaticamente!</p>
        </div>

        {/* Formulário */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-6">
          {/* Tipo de Servidor */}
          <div>
            <label className="block text-white font-semibold mb-3">Tipo de Servidor</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTipo('publico')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  tipo === 'publico'
                    ? 'bg-green-500/20 border-green-400 text-white'
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                }`}
              >
                <Globe className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Público</p>
                <p className="text-xs mt-1 opacity-70">Qualquer um pode entrar</p>
              </button>
              <button
                onClick={() => setTipo('privado')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  tipo === 'privado'
                    ? 'bg-orange-500/20 border-orange-400 text-white'
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                }`}
              >
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Privado</p>
                <p className="text-xs mt-1 opacity-70">Requer pagamento</p>
              </button>
            </div>
          </div>

          {/* Jogo */}
          <div>
            <label className="block text-white font-semibold mb-3">Jogo</label>
            <div className="relative">
              <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={jogo}
                onChange={(e) => setJogo(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jogosDisponiveis.map((j) => (
                  <option key={j} value={j} className="bg-gray-900">
                    {j}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Máximo de Jogadores */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Máximo de Jogadores: {maxJogadores}
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="range"
                min="2"
                max="50"
                value={maxJogadores}
                onChange={(e) => setMaxJogadores(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-white/50 text-sm mt-2">
              <span>2</span>
              <span>50</span>
            </div>
          </div>

          {/* Informações Automáticas */}
          <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-4">
            <p className="text-blue-200 font-semibold mb-2">✨ Gerado Automaticamente:</p>
            <ul className="text-blue-100/80 text-sm space-y-1">
              <li>• ID único do servidor</li>
              <li>• Nome automático (Servidor-UserID-XXXXX)</li>
              <li>• Link de entrada (omlet://join/...)</li>
              <li>• Código de 6 dígitos</li>
              <li>• Endereço IP e porta</li>
              <li>• Sistema de logs e monitoramento</li>
            </ul>
          </div>

          {/* Botão Criar */}
          <button
            onClick={criarServidor}
            disabled={criando}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              criando
                ? 'bg-gray-500 text-white/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105'
            }`}
          >
            {criando ? '🚀 Criando servidor...' : '✨ Criar Servidor Automaticamente'}
          </button>

          {tipo === 'privado' && (
            <p className="text-orange-300 text-sm text-center">
              ⚠️ Servidores privados requerem pagamento de R$ 4,99
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
