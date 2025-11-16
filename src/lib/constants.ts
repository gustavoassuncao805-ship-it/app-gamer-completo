// Constantes e configurações do app gamer

export const GAME_CATEGORIES = [
  { id: 'freefire', name: 'Free Fire', icon: '🔥' },
  { id: 'roblox', name: 'Roblox', icon: '🎮' },
  { id: 'minecraft', name: 'Minecraft', icon: '⛏️' },
  { id: 'fortnite', name: 'Fortnite', icon: '🏆' },
  { id: 'valorant', name: 'Valorant', icon: '🎯' },
  { id: 'lol', name: 'League of Legends', icon: '⚔️' },
];

export const XP_PER_LEVEL = 1000;
export const XP_REWARDS = {
  joinWorld: 50,
  quickMatch: 100,
  sendMessage: 10,
  timeOnline: 5, // por minuto
};

export const COIN_REWARDS = {
  levelUp: 100,
  achievement: 250,
  dailyLogin: 50,
};

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_world',
    name: 'Explorador',
    description: 'Entre no seu primeiro mundo',
    icon: '🌍',
    requirement: 1,
    type: 'worlds' as const,
  },
  {
    id: 'world_master',
    name: 'Mestre dos Mundos',
    description: 'Entre em 50 mundos diferentes',
    icon: '🗺️',
    requirement: 50,
    type: 'worlds' as const,
  },
  {
    id: 'quick_starter',
    name: 'Partida Rápida',
    description: 'Complete sua primeira partida rápida',
    icon: '⚡',
    requirement: 1,
    type: 'quickmatch' as const,
  },
  {
    id: 'quick_veteran',
    name: 'Veterano Rápido',
    description: 'Complete 100 partidas rápidas',
    icon: '🏅',
    requirement: 100,
    type: 'quickmatch' as const,
  },
  {
    id: 'chatty',
    name: 'Comunicativo',
    description: 'Envie 100 mensagens',
    icon: '💬',
    requirement: 100,
    type: 'chat' as const,
  },
  {
    id: 'social_butterfly',
    name: 'Borboleta Social',
    description: 'Envie 1000 mensagens',
    icon: '🦋',
    requirement: 1000,
    type: 'chat' as const,
  },
  {
    id: 'dedicated',
    name: 'Dedicado',
    description: 'Fique online por 10 horas',
    icon: '⏰',
    requirement: 600, // minutos
    type: 'time' as const,
  },
  {
    id: 'no_life',
    name: 'Sem Vida Social',
    description: 'Fique online por 100 horas',
    icon: '🎮',
    requirement: 6000,
    type: 'time' as const,
  },
];

export const QUICK_MESSAGES = [
  '👋 Olá!',
  '😎 GG!',
  '🔥 Partiu!',
  '💪 Vamos nessa!',
  '😂 LOL',
  '👍 Beleza!',
  '❤️ Top!',
  '⚡ Rápido!',
];

export const EMOJIS = [
  '😀', '😂', '😍', '😎', '🤔', '😱', '🔥', '💪',
  '👍', '👎', '❤️', '⚡', '🎮', '🏆', '💯', '🎯',
];

export const PROFANITY_FILTER = [
  // Lista básica de palavras filtradas
  'idiota', 'burro', 'estupido', 'imbecil',
];

export const RANKS = [
  { name: 'Bronze', minXP: 0, color: '#CD7F32' },
  { name: 'Prata', minXP: 5000, color: '#C0C0C0' },
  { name: 'Ouro', minXP: 15000, color: '#FFD700' },
  { name: 'Platina', minXP: 30000, color: '#E5E4E2' },
  { name: 'Diamante', minXP: 50000, color: '#B9F2FF' },
  { name: 'Mestre', minXP: 80000, color: '#9B59B6' },
  { name: 'Lendário', minXP: 120000, color: '#FF1493' },
];

export const SHOP_ITEMS = [
  // Ícones
  { id: 'icon_fire', name: 'Ícone Fogo', type: 'icon' as const, price: 500, image: '🔥', rarity: 'common' as const },
  { id: 'icon_star', name: 'Ícone Estrela', type: 'icon' as const, price: 750, image: '⭐', rarity: 'rare' as const },
  { id: 'icon_crown', name: 'Ícone Coroa', type: 'icon' as const, price: 1500, image: '👑', rarity: 'epic' as const },
  { id: 'icon_diamond', name: 'Ícone Diamante', type: 'icon' as const, price: 3000, image: '💎', rarity: 'legendary' as const },
  
  // Molduras
  { id: 'frame_neon', name: 'Moldura Neon', type: 'frame' as const, price: 1000, image: 'neon', rarity: 'rare' as const },
  { id: 'frame_gold', name: 'Moldura Dourada', type: 'frame' as const, price: 2000, image: 'gold', rarity: 'epic' as const },
  { id: 'frame_legend', name: 'Moldura Lendária', type: 'frame' as const, price: 5000, image: 'legend', rarity: 'legendary' as const },
  
  // Fundos
  { id: 'bg_space', name: 'Fundo Espacial', type: 'background' as const, price: 1500, image: 'space', rarity: 'rare' as const },
  { id: 'bg_cyber', name: 'Fundo Cyberpunk', type: 'background' as const, price: 2500, image: 'cyber', rarity: 'epic' as const },
  { id: 'bg_matrix', name: 'Fundo Matrix', type: 'background' as const, price: 4000, image: 'matrix', rarity: 'legendary' as const },
];
