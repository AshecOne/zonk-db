"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_jwt_guard_1 = require("../auth/guards/ws-jwt.guard");
const game_service_1 = require("./game.service");
const game_action_dto_1 = require("./dto/game-action.dto");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async handleGameStart(client, roomId) {
        const game = await this.gameService.initializeGame(roomId);
        this.server.to(roomId).emit('game:started', game);
        return game;
    }
    async handleGameAction(client, payload) {
        let gameState;
        switch (payload.actionType) {
            case 'DASAR':
                gameState = await this.gameService.playDasar(payload.roomId, client.data.userId, payload.cards);
                break;
            case 'TRIPLE':
                gameState = await this.gameService.playTriple(payload.roomId, client.data.userId, payload.cards);
                break;
            case 'CONNECT':
                gameState = await this.gameService.connectToDasar(payload.roomId, client.data.userId, payload.dasarIndex, payload.cards);
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
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('game:start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleGameStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('game:action'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, game_action_dto_1.GameActionDto]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleGameAction", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map