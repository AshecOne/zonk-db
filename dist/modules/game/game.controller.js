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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const game_service_1 = require("./game.service");
const game_action_dto_1 = require("./dto/game-action.dto");
let GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async startGame(roomId) {
        return this.gameService.initializeGame(roomId);
    }
    async gameAction(req, roomId, actionDto) {
        switch (actionDto.actionType) {
            case 'DASAR':
                return this.gameService.playDasar(roomId, req.user.userId, actionDto.cards);
            case 'TRIPLE':
                return this.gameService.playTriple(roomId, req.user.userId, actionDto.cards);
            case 'CONNECT':
                return this.gameService.connectToDasar(roomId, req.user.userId, actionDto.dasarIndex, actionDto.cards);
            default:
                throw new common_1.BadRequestException('Invalid action type');
        }
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Post)(':roomId/start'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "startGame", null);
__decorate([
    (0, common_1.Post)(':roomId/action'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roomId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, game_action_dto_1.GameActionDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "gameAction", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map