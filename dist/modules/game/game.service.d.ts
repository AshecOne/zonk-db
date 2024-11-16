import { GameState } from './interfaces/game.interface';
import { Card } from './interfaces/card.interface';
import { RoomService } from '../room/room.service';
export declare class GameService {
    private readonly roomService;
    private games;
    constructor(roomService: RoomService);
    initializeGame(roomId: string): Promise<GameState>;
    playDasar(roomId: string, playerId: string, cards: Card[]): Promise<GameState>;
    playTriple(roomId: string, playerId: string, cards: Card[]): Promise<GameState>;
    connectToDasar(roomId: string, playerId: string, dasarIndex: number, cards: Card[]): Promise<GameState>;
    private getGame;
    private getPlayer;
    private validateTurn;
    private removeCardsFromPlayer;
    private updateGameState;
    private checkWinningConditions;
    private updateTurn;
    private generateDeck;
    private shuffleDeck;
    private getPublicGameState;
}
