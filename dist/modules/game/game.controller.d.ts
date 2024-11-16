import { GameService } from './game.service';
import { GameActionDto } from './dto/game-action.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    startGame(roomId: string): Promise<import("./interfaces/game.interface").GameState>;
    gameAction(req: any, roomId: string, actionDto: GameActionDto): Promise<import("./interfaces/game.interface").GameState>;
}
