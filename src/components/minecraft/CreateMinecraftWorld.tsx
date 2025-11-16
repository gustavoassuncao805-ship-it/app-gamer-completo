'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, Save, Lock, Unlock, AlertCircle, CheckCircle } from 'lucide-react';

interface CreateMinecraftWorldProps {
  onBack: () => void;
}

export default function CreateMinecraftWorld({ onBack }: CreateMinecraftWorldProps) {
  const { currentPlayer } = useGame();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ipServidor, setIpServidor] = useState('');
  const [portaServidor, setPortaServidor] = useState('19132');
  const [tipo, setTipo] = useState<'publico' | 'privado'>('publico');
  const [senha, setSenha] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!nome.trim()) {
      setMessage('❌ Digite o nome do mundo');
      setStatus('error');
      return;
    }

    if (!descricao.trim()) {
      setMessage('❌ Digite a descrição do mundo');
      setStatus('error');
      return;
    }

    if (!ipServidor.trim()) {
      setMessage('❌ Digite o IP do servidor');
      setStatus('error');
      return;
    }

    if (!portaServidor.trim() || isNaN(Number(portaServidor))) {
      setMessage('❌ Digite uma porta válida');
      setStatus('error');
      return;
    }

    if (tipo === 'privado' && !senha.trim()) {
      setMessage('❌ Digite uma senha para o mundo privado');
      setStatus('error');
      return;
    }

    setStatus('saving');
    setMessage('💾 Salvando mundo...');

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      const novoMundo = {
        id: Date.now().toString(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        ip_servidor: ipServidor.trim(),
        porta_servidor: Number(portaServidor),
        tipo,
        senha: tipo === 'privado' ? senha : undefined,
        criador: currentPlayer?.name || 'Jogador',
        dataCriacao: new Date().toISOString()
      };

      // Salvar no localStorage
      const mundos = JSON.parse(localStorage.getItem('mundos_minecraft') || '[]');
      mundos.push(novoMundo);
      localStorage.setItem('mundos_minecraft', JSON.stringify(mundos));

      setStatus('success');
      setMessage('✅ Mundo criado com sucesso!');

      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage('❌ Erro ao criar mundo. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Criar Mundo
              </h1>
              <p className="text-gray-400 text-sm">
                Configure seu servidor Minecraft
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
          {/* Nome do Mundo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do Mundo *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Servidor Survival"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              maxLength={50}
            />
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição *
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Servidor de sobrevivência com economia e clans"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              rows={3}
              maxLength={200}
            />
          </div>

          {/* IP do Servidor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              IP do Servidor *
            </label>
            <input
              type="text"
              value={ipServidor}
              onChange={(e) => setIpServidor(e.target.value)}
              placeholder="Ex: play.meuservidor.com ou 192.168.1.100"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Porta do Servidor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Porta do Servidor *
            </label>
            <input
              type="number"
              value={portaServidor}
              onChange={(e) => setPortaServidor(e.target.value)}
              placeholder="19132"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
              min="1"
              max="65535"
            />
            <p className="text-xs text-gray-500 mt-1">Porta padrão do Minecraft Bedrock: 19132</p>
          </div>

          {/* Tipo do Mundo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo do Mundo *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipo('publico')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                  tipo === 'publico'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-black/30 border-purple-500/30 text-gray-400 hover:border-purple-500/60'
                }`}
              >
                <Unlock className="w-5 h-5" />
                <span className="font-bold">Público</span>
              </button>
              <button
                type="button"
                onClick={() => setTipo('privado')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                  tipo === 'privado'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-black/30 border-purple-500/30 text-gray-400 hover:border-purple-500/60'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="font-bold">Privado</span>
              </button>
            </div>
          </div>

          {/* Senha (apenas para mundos privados) */}
          {tipo === 'privado' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha do Mundo *
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite uma senha segura"
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <p className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Apenas usuários com a senha poderão entrar
              </p>
            </div>
          )}

          {/* Botão Criar */}
          <button
            type="submit"
            disabled={status === 'saving'}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg ${
              status === 'saving'
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/30'
            }`}
          >
            {status === 'saving' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Criar Mundo
              </>
            )}
          </button>

          {/* Mensagem de Status */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                status === 'success'
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : status === 'error'
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                  : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : status === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : null}
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Informações */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Como funciona:
            </h3>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Digite as informações do seu servidor Minecraft</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Mundos <strong>públicos</strong> podem ser acessados por qualquer pessoa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Mundos <strong>privados</strong> exigem senha para entrar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>O botão "Entrar no Minecraft" abrirá o jogo automaticamente</span>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
