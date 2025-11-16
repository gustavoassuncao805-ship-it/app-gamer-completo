'use client';

import { useState } from 'react';
import { ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { SHOP_ITEMS } from '@/lib/constants';

export default function Shop() {
  const { currentPlayer, addCoins } = useGame();
  const [selectedType, setSelectedType] = useState<'all' | 'icon' | 'frame' | 'background'>('all');
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const filteredItems = selectedType === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.type === selectedType);

  const handlePurchase = (itemId: string, price: number) => {
    if (!currentPlayer || currentPlayer.coins < price) {
      alert('Moedas insuficientes!');
      return;
    }

    addCoins(-price);
    setPurchasedItems([...purchasedItems, itemId]);
    alert('Item comprado com sucesso! 🎉');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⚪ Comum';
      case 'rare': return '🔵 Raro';
      case 'epic': return '🟣 Épico';
      case 'legendary': return '🟡 Lendário';
      default: return '⚪ Comum';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Loja
          </h2>
          <p className="text-gray-400 mt-1">Personalize seu perfil com itens exclusivos</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-6 py-3 rounded-xl">
          <span className="text-3xl">💰</span>
          <div>
            <p className="text-yellow-400 font-bold text-xl">{currentPlayer?.coins || 0}</p>
            <p className="text-gray-400 text-xs">Suas moedas</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            selectedType === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedType('icon')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            selectedType === 'icon'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Ícones
        </button>
        <button
          onClick={() => setSelectedType('frame')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            selectedType === 'frame'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Molduras
        </button>
        <button
          onClick={() => setSelectedType('background')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            selectedType === 'background'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Fundos
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = (currentPlayer?.coins || 0) >= item.price;

          return (
            <div
              key={item.id}
              className={`group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border transition-all duration-300 hover:scale-105 overflow-hidden ${
                isPurchased
                  ? 'border-green-500/50 shadow-lg shadow-green-500/30'
                  : 'border-purple-500/30 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-purple-500/30'
              }`}
            >
              {/* Rarity Banner */}
              <div className={`bg-gradient-to-r ${getRarityColor(item.rarity)} py-2 px-4`}>
                <p className="text-white text-xs font-bold text-center">
                  {getRarityBadge(item.rarity)}
                </p>
              </div>

              {/* Item Display */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-center h-24">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {item.image}
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">💰</span>
                    <span className="text-yellow-400 font-bold text-xl">{item.price}</span>
                  </div>

                  {/* Type Badge */}
                  <div className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium capitalize">
                      {item.type === 'icon' ? 'Ícone' : item.type === 'frame' ? 'Moldura' : 'Fundo'}
                    </span>
                  </div>
                </div>

                {/* Purchase Button */}
                {isPurchased ? (
                  <div className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Comprado
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={!canAfford}
                    className={`w-full py-3 font-bold rounded-xl transition-all duration-300 ${
                      canAfford
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Comprar' : 'Moedas Insuficientes'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-2xl font-bold text-gray-400 mb-2">Nenhum item encontrado</h3>
          <p className="text-gray-500">Tente outro filtro</p>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Como ganhar moedas?</h3>
            <ul className="text-gray-400 space-y-1 text-sm">
              <li>• Suba de nível: <span className="text-yellow-400 font-bold">+100 moedas</span></li>
              <li>• Complete conquistas: <span className="text-yellow-400 font-bold">+250 moedas</span></li>
              <li>• Login diário: <span className="text-yellow-400 font-bold">+50 moedas</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
