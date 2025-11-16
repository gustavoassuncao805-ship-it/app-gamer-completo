export interface Server {
  id: string;
  nome: string;
  tipo: 'publico' | 'privado';
  jogo: string;
  criador: string;
  status: 'online' | 'offline' | 'pausado';
  jogadores: Jogador[];
  maxJogadores: number;
  senha?: string;
  criadoEm: number;
  ultimaAtividade: number;
  logs: ServerLog[];
  banidos: string[];
  linkEntrada?: string;
  codigoEntrada?: string;
  ping?: number;
  ip?: string;
  porta?: number;
}

export interface Jogador {
  id: string;
  nome: string;
  avatar: string;
  entradaEm: number;
}

export interface ServerLog {
  id: string;
  tipo: 'sistema' | 'entrada' | 'saida' | 'kick' | 'ban' | 'chat';
  mensagem: string;
  timestamp: number;
  usuario?: string;
}
