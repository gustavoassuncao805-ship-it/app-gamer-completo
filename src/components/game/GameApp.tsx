'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Zap, Users, Trophy, User, ShoppingBag, Menu, X, Lock, Shield, Gamepad2, Server } from 'lucide-react';
import WorldsGrid from '@/components/game/WorldsGrid';
import QuickMatch from '@/components/game/QuickMatch';
import PublicRooms from '@/components/game/PublicRooms';
import Rankings from '@/components/game/Rankings';
import Profile from '@/components/game/Profile';
import Shop from '@/components/game/Shop';
import CreatePrivateWorld from '@/components/game/CreatePrivateWorld';
import AdminPanel from '@/components/game/AdminPanel';
import MinecraftWorlds from '@/components/minecraft/MinecraftWorlds';
import CreateMinecraftWorld from '@/components/minecraft/CreateMinecraftWorld';
import ServerSystem from '@/components/omlet/ServerSystem';

type View = 'home' | 'quickmatch' | 'rooms' | 'rankings' | 'profile' | 'shop' | 'create-private' | 'admin' | 'minecraft' | 'create-minecraft' | 'servers';

export default function GameApp() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPlayer } = useGame();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <WorldsGrid onMinecraftClick={() => setCurrentView('minecraft')} />;
      case 'quickmatch':
        return <QuickMatch />;
      case 'rooms':
        return <PublicRooms />;
      case 'rankings':
        return <Rankings />;
      case 'profile':
        return <Profile />;
      case 'shop':
        return <Shop />;
      case 'create-private':
        return <CreatePrivateWorld onBack={() => setCurrentView('home')} />;
      case 'admin':
        return <AdminPanel onBack={() => setCurrentView('home')} />;
      case 'minecraft':
        return <MinecraftWorlds onBack={() => setCurrentView('home')} onCreateWorld={() => setCurrentView('create-minecraft')} />;
      case 'create-minecraft':
        return <CreateMinecraftWorld onBack={() => setCurrentView('minecraft')} />;
      case 'servers':
        return <ServerSystem />;
      default:
        return <WorldsGrid onMinecraftClick={() => setCurrentView('minecraft')} />;
    }
  };

  const menuItems = [
    { id: 'home' as View, label: 'Mundos', icon: Users },
    { id: 'servers' as View, label: 'Servidores Online', icon: Server },
    { id: 'minecraft' as View, label: 'Minecraft', icon: Gamepad2 },
    { id: 'quickmatch' as View, label: 'Partida Rápida', icon: Zap },
    { id: 'rooms' as View, label: 'Salas', icon: Users },
    { id: 'rankings' as View, label: 'Rankings', icon: Trophy },
    { id: 'shop' as View, label: 'Loja', icon: ShoppingBag },
    { id: 'profile' as View, label: 'Perfil', icon: User },
    { id: 'create-private' as View, label: 'Mundo Privado', icon: Lock },
    { id: 'admin' as View, label: 'Admin', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                MundoXtreme
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Player Info */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
                <span className="text-2xl">💰</span>
                <span className="text-yellow-400 font-bold">{currentPlayer?.coins || 0}</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/30">
                <span className="text-2xl">⭐</span>
                <span className="text-cyan-400 font-bold">Nv {currentPlayer?.level || 1}</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg border-t border-purple-500/30">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Player Info */}
              <div className="flex gap-2 pt-4 border-t border-purple-500/30">
                <div className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 py-3 rounded-lg border border-yellow-500/30">
                  <span className="text-xl">💰</span>
                  <span className="text-yellow-400 font-bold">{currentPlayer?.coins || 0}</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 py-3 rounded-lg border border-cyan-500/30">
                  <span className="text-xl">⭐</span>
                  <span className="text-cyan-400 font-bold">Nv {currentPlayer?.level || 1}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}
