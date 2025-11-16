// Types para o aplicativo gamer

export interface Player {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  coins: number;
  rank: string;
  achievements: string[];
  profileFrame?: string;
  profileBackground?: string;
  createdAt: Date;
  totalPlayTime: number;
}

export interface World {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  players: number;
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
  createdBy: string;
  creatorName: string;
  createdAt: Date;
  playersInside: string[]; // IDs dos jogadores dentro do mundo
}

export interface Room {
  id: string;
  category: string;
  players: Player[];
  maxPlayers: number;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  message: string;
  timestamp: Date;
  isFiltered?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'worlds' | 'quickmatch' | 'chat' | 'time' | 'level';
  unlocked: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'icon' | 'frame' | 'background';
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface RankingEntry {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  score: number;
  level: number;
  rank: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}
