'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player, World, Room, Achievement, RankingEntry, ChatMessage } from '@/lib/types';
import { ACHIEVEMENTS_LIST, XP_PER_LEVEL, COIN_REWARDS, RANKS } from '@/lib/constants';

interface GameContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player) => void;
  worlds: World[];
  setWorlds: (worlds: World[]) => void;
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  currentWorld: World | null;
  setCurrentWorld: (world: World | null) => void;
  worldMessages: ChatMessage[];
  addWorldMessage: (message: ChatMessage) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  checkAchievements: () => void;
  rankings: RankingEntry[];
  updateRankings: () => void;
  createWorld: (world: Omit<World, 'id' | 'createdAt' | 'players' | 'playersInside'>) => void;
  updateWorld: (worldId: string, updates: Partial<World>) => void;
  joinWorld: (worldId: string, password?: string) => boolean;
  leaveWorld: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentPlayer, setCurrentPlayerState] = useState<Player | null>(null);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [worldMessages, setWorldMessages] = useState<ChatMessage[]>([]);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  // Inicializar jogador padrão
  useEffect(() => {
    const defaultPlayer: Player = {
      id: '1',
      name: 'Jogador Pro',
      avatar: '🎮',
      bio: 'Gamer apaixonado por jogos!',
      level: 1,
      xp: 0,
      coins: 500,
      rank: 'Bronze',
      achievements: [],
      createdAt: new Date(),
      totalPlayTime: 0,
    };
    setCurrentPlayerState(defaultPlayer);

    // Mundos iniciais
    const initialWorlds: World[] = [
      {
        id: '1',
        name: 'Arena Free Fire',
        description: 'Batalha épica no deserto',
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
        category: 'Free Fire',
        players: 24,
        maxPlayers: 50,
        isPrivate: false,
        createdBy: 'system',
        creatorName: 'GameHub',
        createdAt: new Date(),
        playersInside: [],
      },
      {
        id: '2',
        name: 'Mundo Roblox',
        description: 'Aventuras infinitas te esperam',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
        category: 'Roblox',
        players: 18,
        maxPlayers: 30,
        isPrivate: false,
        createdBy: 'system',
        creatorName: 'GameHub',
        createdAt: new Date(),
        playersInside: [],
      },
      {
        id: '3',
        name: 'Minecraft Survival',
        description: 'Construa e sobreviva',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
        category: 'Minecraft',
        players: 32,
        maxPlayers: 40,
        isPrivate: false,
        createdBy: 'system',
        creatorName: 'GameHub',
        createdAt: new Date(),
        playersInside: [],
      },
      {
        id: '4',
        name: 'Fortnite Battle',
        description: 'Última pessoa em pé vence',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        category: 'Fortnite',
        players: 45,
        maxPlayers: 100,
        isPrivate: false,
        createdBy: 'system',
        creatorName: 'GameHub',
        createdAt: new Date(),
        playersInside: [],
      },
      {
        id: '5',
        name: 'Valorant Spike Rush',
        description: 'Ação tática intensa',
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
        category: 'Valorant',
        players: 10,
        maxPlayers: 10,
        isPrivate: false,
        createdBy: 'system',
        creatorName: 'GameHub',
        createdAt: new Date(),
        playersInside: [],
      },
      {
        id: '6',
        name: 'LoL ARAM',
        description: 'Batalha rápida 5v5',
        image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop',
        category: 'League of Legends',
        players: 8,
        maxPlayers: 10,
        isPrivate: false,
        createdBy: 'system',
        creatorName: 'GameHub',
        createdAt: new Date(),
        playersInside: [],
      },
    ];
    setWorlds(initialWorlds);
  }, []);

  const setCurrentPlayer = (player: Player) => {
    setCurrentPlayerState(player);
  };

  const addXP = (amount: number) => {
    if (!currentPlayer) return;

    const newXP = currentPlayer.xp + amount;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > currentPlayer.level;

    const updatedPlayer = {
      ...currentPlayer,
      xp: newXP,
      level: newLevel,
      coins: leveledUp ? currentPlayer.coins + COIN_REWARDS.levelUp : currentPlayer.coins,
      rank: RANKS.find(r => newXP >= r.minXP)?.name || 'Bronze',
    };

    setCurrentPlayerState(updatedPlayer);
    
    if (leveledUp) {
      checkAchievements();
    }
  };

  const addCoins = (amount: number) => {
    if (!currentPlayer) return;
    setCurrentPlayerState({
      ...currentPlayer,
      coins: currentPlayer.coins + amount,
    });
  };

  const checkAchievements = () => {
    if (!currentPlayer) return;
    
    // Lógica de verificação de conquistas será implementada
    // quando tivermos estatísticas completas
  };

  const updateRankings = () => {
    // Simular rankings
    const mockRankings: RankingEntry[] = [
      { playerId: '1', playerName: 'ProGamer123', playerAvatar: '👑', score: 15000, level: 25, rank: 1 },
      { playerId: '2', playerName: 'NinjaKiller', playerAvatar: '⚔️', score: 12500, level: 22, rank: 2 },
      { playerId: '3', playerName: 'MasterChief', playerAvatar: '🎯', score: 11000, level: 20, rank: 3 },
      { playerId: '4', playerName: 'ShadowHunter', playerAvatar: '🌙', score: 9500, level: 18, rank: 4 },
      { playerId: '5', playerName: 'FireStorm', playerAvatar: '🔥', score: 8800, level: 17, rank: 5 },
    ];
    setRankings(mockRankings);
  };

  const createWorld = (worldData: Omit<World, 'id' | 'createdAt' | 'players' | 'playersInside'>) => {
    if (!currentPlayer) return;

    const newWorld: World = {
      ...worldData,
      id: Date.now().toString(),
      createdAt: new Date(),
      players: 0,
      playersInside: [],
    };

    setWorlds(prev => [newWorld, ...prev]);
    addXP(100); // XP por criar mundo
    addCoins(50); // Moedas por criar mundo
  };

  const updateWorld = (worldId: string, updates: Partial<World>) => {
    setWorlds(prev => prev.map(world => 
      world.id === worldId ? { ...world, ...updates } : world
    ));

    // Atualizar currentWorld se for o mundo atual
    if (currentWorld?.id === worldId) {
      setCurrentWorld(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const joinWorld = (worldId: string, password?: string): boolean => {
    if (!currentPlayer) return false;

    const world = worlds.find(w => w.id === worldId);
    if (!world) return false;

    // Verificar senha se mundo privado
    if (world.isPrivate && world.password !== password) {
      return false;
    }

    // Verificar se mundo está cheio
    if (world.players >= world.maxPlayers) {
      return false;
    }

    // Adicionar jogador ao mundo
    const updatedWorld = {
      ...world,
      players: world.players + 1,
      playersInside: [...world.playersInside, currentPlayer.id],
    };

    updateWorld(worldId, updatedWorld);
    setCurrentWorld(updatedWorld);
    addXP(50); // XP por entrar em mundo

    return true;
  };

  const leaveWorld = () => {
    if (!currentWorld || !currentPlayer) return;

    const updatedWorld = {
      ...currentWorld,
      players: Math.max(0, currentWorld.players - 1),
      playersInside: currentWorld.playersInside.filter(id => id !== currentPlayer.id),
    };

    updateWorld(currentWorld.id, updatedWorld);
    setCurrentWorld(null);
    setWorldMessages([]);
  };

  const addWorldMessage = (message: ChatMessage) => {
    setWorldMessages(prev => [...prev, message]);
  };

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer,
        worlds,
        setWorlds,
        currentRoom,
        setCurrentRoom,
        currentWorld,
        setCurrentWorld,
        worldMessages,
        addWorldMessage,
        addXP,
        addCoins,
        checkAchievements,
        rankings,
        updateRankings,
        createWorld,
        updateWorld,
        joinWorld,
        leaveWorld,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
