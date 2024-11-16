import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { GameService } from './game.service';
import { GameActionDto } from './dto/game-action.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('game:start')
  async handleGameStart(client: Socket, roomId: string) {
    const game = await this.gameService.initializeGame(roomId);
    this.server.to(roomId).emit('game:started', game);
    return game;
  }

  @SubscribeMessage('game:action')
  async handleGameAction(client: Socket, payload: GameActionDto) {
    let gameState;

    switch (payload.actionType) {
      case 'DASAR':
        gameState = await this.gameService.playDasar(
          payload.roomId,
          client.data.userId,
          payload.cards
        );
        break;
      case 'TRIPLE':
        gameState = await this.gameService.playTriple(
          payload.roomId,
          client.data.userId,
          payload.cards
        );
        break;
      case 'CONNECT':
        gameState = await this.gameService.connectToDasar(
          payload.roomId,
          client.data.userId,
          payload.dasarIndex,
          payload.cards
        );
        break;
    }

    this.server.to(payload.roomId).emit('game:updated', gameState);
    
    if (gameState.status === 'FINISHED') {
      this.server.to(payload.roomId).emit('game:finished', {
        winner: gameState.winner,
        gameState
      });
    }

    return gameState;
  }
}