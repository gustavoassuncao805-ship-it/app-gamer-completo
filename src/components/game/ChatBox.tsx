'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { ChatMessage } from '@/lib/types';
import { QUICK_MESSAGES, EMOJIS, PROFANITY_FILTER } from '@/lib/constants';

interface ChatBoxProps {
  roomId: string;
}

export default function ChatBox({ roomId }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentPlayer, addXP } = useGame();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filterMessage = (text: string): string => {
    let filtered = text;
    PROFANITY_FILTER.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '***');
    });
    return filtered;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentPlayer) return;

    const filteredMessage = filterMessage(inputMessage);
    const isFiltered = filteredMessage !== inputMessage;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerAvatar: currentPlayer.avatar,
      message: filteredMessage,
      timestamp: new Date(),
      isFiltered,
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    addXP(10); // XP por mensagem
  };

  const handleQuickMessage = (message: string) => {
    if (!currentPlayer) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerAvatar: currentPlayer.avatar,
      message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setShowQuickMessages(false);
    addXP(10);
  };

  const handleEmojiClick = (emoji: string) => {
    setInputMessage(inputMessage + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-black/30 rounded-xl border border-purple-500/20">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-gray-500">Nenhuma mensagem ainda</p>
            <p className="text-gray-600 text-sm mt-1">Seja o primeiro a falar!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.playerId === currentPlayer?.id ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                {msg.playerAvatar}
              </div>

              {/* Message */}
              <div
                className={`max-w-[70%] ${
                  msg.playerId === currentPlayer?.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                    : 'bg-gray-700'
                } rounded-2xl px-4 py-2`}
              >
                <p className="text-xs text-gray-300 mb-1">{msg.playerName}</p>
                <p className="text-white break-words">{msg.message}</p>
                {msg.isFiltered && (
                  <p className="text-xs text-yellow-400 mt-1">⚠️ Mensagem filtrada</p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      {showQuickMessages && (
        <div className="border-t border-purple-500/20 p-3 bg-black/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_MESSAGES.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleQuickMessage(msg)}
                className="px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-600/30 border border-cyan-500/30 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="border-t border-purple-500/20 p-3 bg-black/50">
          <div className="grid grid-cols-8 gap-2">
            {EMOJIS.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:scale-125 transition-transform duration-200"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-purple-500/20 p-4">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => {
              setShowQuickMessages(!showQuickMessages);
              setShowEmojis(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showQuickMessages
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ⚡ Rápidas
          </button>
          <button
            onClick={() => {
              setShowEmojis(!showEmojis);
              setShowQuickMessages(false);
            }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showEmojis
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl border border-purple-500/30 focus:border-cyan-500/50 focus:outline-none transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
