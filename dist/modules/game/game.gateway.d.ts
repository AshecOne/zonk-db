import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { GameActionDto } from './dto/game-action.dto';
export declare class GameGateway {
    private readonly gameService;
    server: Server;
    constructor(gameService: GameService);
    handleGameStart(client: Socket, roomId: string): Promise<import("./interfaces/game.interface").GameState>;
    handleGameAction(client: Socket, payload: GameActionDto): Promise<any>;
}
