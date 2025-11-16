'use client';

import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { X, Send, Users, Crown, Settings, Lock, Globe, Image as ImageIcon } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

export default function WorldDetail() {
  const { currentWorld, currentPlayer, leaveWorld, worldMessages, addWorldMessage, updateWorld } = useGame();
  const [message, setMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: currentWorld?.name || '',
    description: currentWorld?.description || '',
    isPrivate: currentWorld?.isPrivate || false,
    password: currentWorld?.password || '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isOwner = currentPlayer?.id === currentWorld?.createdBy;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [worldMessages]);

  if (!currentWorld) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentPlayer) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerAvatar: currentPlayer.avatar,
      message: message.trim(),
      timestamp: new Date(),
    };

    addWorldMessage(newMessage);
    setMessage('');
  };

  const handleSaveSettings = () => {
    if (!currentWorld) return;

    if (editData.isPrivate && !editData.password.trim()) {
      alert('Digite uma senha para o mundo privado!');
      return;
    }

    updateWorld(currentWorld.id, {
      name: editData.name,
      description: editData.description,
      isPrivate: editData.isPrivate,
      password: editData.isPrivate ? editData.password : undefined,
    });

    setEditMode(false);
    setShowSettings(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 max-w-5xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 sm:p-6 rounded-t-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={currentWorld.image}
              alt={currentWorld.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white/30"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                {currentWorld.name}
              </h2>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Users className="w-4 h-4" />
                <span>{currentWorld.players} jogadores</span>
                {currentWorld.isPrivate && <Lock className="w-4 h-4" />}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            )}
            <button
              onClick={leaveWorld}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Sair"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && isOwner && (
          <div className="bg-black/50 border-b border-purple-500/30 p-4 space-y-4">
            {!editMode ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Configurações do Mundo</h3>
                  <p className="text-gray-400 text-sm">Você é o dono deste mundo</p>
                </div>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setEditData({
                      name: currentWorld.name,
                      description: currentWorld.description,
                      isPrivate: currentWorld.isPrivate,
                      password: currentWorld.password || '',
                    });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all"
                >
                  Editar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-white text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">Descrição</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.isPrivate}
                      onChange={(e) => setEditData({ ...editData, isPrivate: e.target.checked })}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-white text-sm">Mundo Privado</span>
                  </label>
                </div>

                {editData.isPrivate && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Senha</label>
                    <input
                      type="text"
                      value={editData.password}
                      onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      placeholder="Digite uma senha"
                      className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {worldMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhuma mensagem ainda</h3>
              <p className="text-gray-500">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          ) : (
            worldMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.playerId === currentPlayer?.id ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                  {msg.playerAvatar}
                </div>
                <div
                  className={`flex-1 max-w-[70%] ${
                    msg.playerId === currentPlayer?.id ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{msg.playerName}</span>
                    {msg.playerId === currentWorld.createdBy && (
                      <Crown className="w-4 h-4 text-yellow-400" title="Dono do Mundo" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.playerId === currentPlayer?.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-500/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
