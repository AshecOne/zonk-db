import { Card } from './card.interface';

export interface GamePlayer {
  id: string;
  username: string;
  cards: Card[];
  isAlive: boolean;
  score: number;
  order: number;
}

export interface GameState {
  roomId: string;
  players: GamePlayer[];
  currentTurn: number;
  tableCards: Card[];
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  baseCards: Card[][];
  tripleCards: Card[][];
  winner?: GamePlayer;
  lastAction?: {
    playerId: string;
    actionType: string;
    timestamp: Date;
  };
}