import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { GameState, GamePlayer } from './interfaces/game.interface';
import { Card, CardType, CardValue } from './interfaces/card.interface';
import { CardValidator } from './validators/card.validator';
import { RoomService } from '../room/room.service';

@Injectable()
export class GameService {
  private games: Map<string, GameState> = new Map();

  constructor(private readonly roomService: RoomService) {}

  async initializeGame(roomId: string): Promise<GameState> {
    const room = this.roomService.getRoomById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const deck = this.generateDeck();
    const players = room.players.map(p => ({
      id: p.id,
      username: p.username,
      cards: deck.splice(0, 20),
      isAlive: true,
      score: 0,
      order: p.position
    }));

    const gameState: GameState = {
      roomId,
      players,
      currentTurn: 0,
      tableCards: [],
      status: 'PLAYING',
      baseCards: [],
      tripleCards: [],
      lastAction: {
        playerId: players[0].id,
        actionType: 'GAME_START',
        timestamp: new Date()
      }
    };

    this.games.set(roomId, gameState);
    return this.getPublicGameState(gameState);
  }

  async playDasar(roomId: string, playerId: string, cards: Card[]): Promise<GameState> {
    const game = this.getGame(roomId);
    const player = this.getPlayer(game, playerId);

    this.validateTurn(game, playerId);
    
    if (!CardValidator.validateDasar(cards)) {
      throw new BadRequestException('Invalid dasar combination');
    }

    this.removeCardsFromPlayer(player, cards);
    game.baseCards.push(cards);
    
    game.lastAction = {
      playerId,
      actionType: 'PLAY_DASAR',
      timestamp: new Date()
    };

    this.updateGameState(game);
    return this.getPublicGameState(game);
  }

  async playTriple(roomId: string, playerId: string, cards: Card[]): Promise<GameState> {
    const game = this.getGame(roomId);
    const player = this.getPlayer(game, playerId);

    this.validateTurn(game, playerId);

    if (!CardValidator.validateTriple(cards)) {
      throw new BadRequestException('Invalid triple combination');
    }

    this.removeCardsFromPlayer(player, cards);
    game.tripleCards.push(cards);

    game.lastAction = {
      playerId,
      actionType: 'PLAY_TRIPLE',
      timestamp: new Date()
    };

    this.updateGameState(game);
    return this.getPublicGameState(game);
  }

  async connectToDasar(
    roomId: string,
    playerId: string,
    dasarIndex: number,
    cards: Card[]
  ): Promise<GameState> {
    const game = this.getGame(roomId);
    const player = this.getPlayer(game, playerId);
    const existingDasar = game.baseCards[dasarIndex];

    this.validateTurn(game, playerId);

    if (!existingDasar) {
      throw new BadRequestException('Invalid dasar index');
    }

    if (!CardValidator.validateConnection(existingDasar, cards)) {
      throw new BadRequestException('Invalid connection');
    }

    this.removeCardsFromPlayer(player, cards);
    game.baseCards[dasarIndex] = [...existingDasar, ...cards];

    game.lastAction = {
      playerId,
      actionType: 'CONNECT_DASAR',
      timestamp: new Date()
    };

    this.updateGameState(game);
    return this.getPublicGameState(game);
  }

  private getGame(roomId: string): GameState {
    const game = this.games.get(roomId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  private getPlayer(game: GameState, playerId: string): GamePlayer {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  private validateTurn(game: GameState, playerId: string): void {
    const currentPlayer = game.players[game.currentTurn];
    if (currentPlayer.id !== playerId) {
      throw new BadRequestException('Not your turn');
    }
    if (!currentPlayer.isAlive) {
      throw new BadRequestException('Player is not alive');
    }
  }

  private removeCardsFromPlayer(player: GamePlayer, cards: Card[]): void {
    player.cards = player.cards.filter(card => 
      !cards.some(playedCard => 
        playedCard.value === card.value && 
        playedCard.type === card.type
      )
    );
  }

  private updateGameState(game: GameState): void {
    this.checkWinningConditions(game);
    this.updateTurn(game);
    this.games.set(game.roomId, game);
  }

  private checkWinningConditions(game: GameState): void {
    for (const player of game.players) {
      if (CardValidator.checkGameTangan(player.cards)) {
        game.status = 'FINISHED';
        game.winner = player;
        return;
      }
      if (player.cards.length === 0) {
        game.status = 'FINISHED';
        game.winner = player;
        return;
      }
    }
  }

  private updateTurn(game: GameState): void {
    if (game.status === 'FINISHED') return;

    let nextTurn = (game.currentTurn + 1) % game.players.length;
    while (!game.players[nextTurn].isAlive) {
      nextTurn = (nextTurn + 1) % game.players.length;
    }
    game.currentTurn = nextTurn;
  }

  private generateDeck(): Card[] {
    // Same as your existing generateDeck implementation
    const deck: Card[] = [];
    
    for (let set = 0; set < 2; set++) {
      Object.values(CardType).forEach(type => {
        Object.values(CardValue).forEach(value => {
          if (value !== CardValue.JOKER) {
            deck.push({ type, value, isJoker: false });
          }
        });
      });
    }
    
    for (let i = 0; i < 8; i++) {
      deck.push({ value: CardValue.JOKER, isJoker: true });
    }
    
    return this.shuffleDeck(deck);
  }

  private shuffleDeck(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private getPublicGameState(game: GameState): GameState {
    return {
      ...game,
      players: game.players.map(player => ({
        ...player,
        cards: player.cards.map(card => ({
          ...card,
          isHidden: true
        }))
      }))
    };
  }
}