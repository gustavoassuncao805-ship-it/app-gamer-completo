'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { X, Upload, Lock, Globe, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface CreateWorldProps {
  onClose: () => void;
  hasPrivateAccess: boolean;
}

const CATEGORIES = [
  'Free Fire',
  'Roblox',
  'Minecraft',
  'Fortnite',
  'Valorant',
  'League of Legends',
  'PUBG',
  'Among Us',
  'Fall Guys',
  'Outro',
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop',
];

export default function CreateWorld({ onClose, hasPrivateAccess }: CreateWorldProps) {
  const { createWorld, currentPlayer } = useGame();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: DEFAULT_IMAGES[0],
    category: CATEGORIES[0],
    maxPlayers: 50,
    isPrivate: false,
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Digite um nome para o mundo!');
      return;
    }

    if (formData.isPrivate && !hasPrivateAccess) {
      alert('Você precisa pagar R$ 4,99 para criar mundos privados! Acesse "Mundo Privado" no menu.');
      return;
    }

    if (formData.isPrivate && !formData.password.trim()) {
      alert('Digite uma senha para o mundo privado!');
      return;
    }

    createWorld({
      name: formData.name,
      description: formData.description,
      image: formData.image,
      category: formData.category,
      maxPlayers: formData.maxPlayers,
      isPrivate: formData.isPrivate,
      password: formData.isPrivate ? formData.password : undefined,
      createdBy: currentPlayer?.id || '1',
      creatorName: currentPlayer?.name || 'Jogador',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-purple-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Criar Novo Mundo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome do Mundo */}
          <div>
            <label className="block text-white font-medium mb-2">
              Nome do Mundo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Arena Épica"
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              maxLength={50}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-white font-medium mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva seu mundo..."
              rows={3}
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              maxLength={200}
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-white font-medium mb-2">
              Imagem do Mundo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DEFAULT_IMAGES.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: img })}
                  className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    formData.image === img
                      ? 'border-cyan-500 scale-105'
                      : 'border-purple-500/30 hover:border-purple-500/50'
                  }`}
                >
                  <img src={img} alt={`Opção ${index + 1}`} className="w-full h-full object-cover" />
                  {formData.image === img && (
                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-white font-medium mb-2">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Máximo de Jogadores */}
          <div>
            <label className="block text-white font-medium mb-2">
              Máximo de Jogadores: {formData.maxPlayers}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={formData.maxPlayers}
              onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Tipo de Mundo */}
          <div>
            <label className="block text-white font-medium mb-3">
              Tipo de Mundo
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPrivate: false, password: '' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !formData.isPrivate
                    ? 'border-cyan-500 bg-cyan-500/20'
                    : 'border-purple-500/30 bg-black/30 hover:border-purple-500/50'
                }`}
              >
                <Globe className={`w-8 h-8 mx-auto mb-2 ${!formData.isPrivate ? 'text-cyan-400' : 'text-gray-400'}`} />
                <div className="text-white font-medium">Público</div>
                <div className="text-xs text-gray-400 mt-1">Qualquer um pode entrar</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPrivate: true })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.isPrivate
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-purple-500/30 bg-black/30 hover:border-purple-500/50'
                }`}
              >
                <Lock className={`w-8 h-8 mx-auto mb-2 ${formData.isPrivate ? 'text-purple-400' : 'text-gray-400'}`} />
                <div className="text-white font-medium">Privado</div>
                <div className="text-xs text-gray-400 mt-1">Requer senha</div>
              </button>
            </div>

            {/* Aviso de Pagamento */}
            {formData.isPrivate && !hasPrivateAccess && (
              <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium text-sm">
                    Mundos privados requerem pagamento
                  </p>
                  <p className="text-yellow-300/80 text-xs mt-1">
                    Acesse "Mundo Privado" no menu para pagar R$ 4,99 e desbloquear esta funcionalidade.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Senha (se privado) */}
          {formData.isPrivate && (
            <div>
              <label className="block text-white font-medium mb-2">
                Senha do Mundo *
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Digite uma senha"
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                maxLength={20}
              />
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
            >
              Criar Mundo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
