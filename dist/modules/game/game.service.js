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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const card_interface_1 = require("./interfaces/card.interface");
const card_validator_1 = require("./validators/card.validator");
const room_service_1 = require("../room/room.service");
let GameService = class GameService {
    constructor(roomService) {
        this.roomService = roomService;
        this.games = new Map();
    }
    async initializeGame(roomId) {
        const room = this.roomService.getRoomById(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
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
        const gameState = {
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
    async playDasar(roomId, playerId, cards) {
        const game = this.getGame(roomId);
        const player = this.getPlayer(game, playerId);
        this.validateTurn(game, playerId);
        if (!card_validator_1.CardValidator.validateDasar(cards)) {
            throw new common_1.BadRequestException('Invalid dasar combination');
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
    async playTriple(roomId, playerId, cards) {
        const game = this.getGame(roomId);
        const player = this.getPlayer(game, playerId);
        this.validateTurn(game, playerId);
        if (!card_validator_1.CardValidator.validateTriple(cards)) {
            throw new common_1.BadRequestException('Invalid triple combination');
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
    async connectToDasar(roomId, playerId, dasarIndex, cards) {
        const game = this.getGame(roomId);
        const player = this.getPlayer(game, playerId);
        const existingDasar = game.baseCards[dasarIndex];
        this.validateTurn(game, playerId);
        if (!existingDasar) {
            throw new common_1.BadRequestException('Invalid dasar index');
        }
        if (!card_validator_1.CardValidator.validateConnection(existingDasar, cards)) {
            throw new common_1.BadRequestException('Invalid connection');
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
    getGame(roomId) {
        const game = this.games.get(roomId);
        if (!game) {
            throw new common_1.NotFoundException('Game not found');
        }
        return game;
    }
    getPlayer(game, playerId) {
        const player = game.players.find(p => p.id === playerId);
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        return player;
    }
    validateTurn(game, playerId) {
        const currentPlayer = game.players[game.currentTurn];
        if (currentPlayer.id !== playerId) {
            throw new common_1.BadRequestException('Not your turn');
        }
        if (!currentPlayer.isAlive) {
            throw new common_1.BadRequestException('Player is not alive');
        }
    }
    removeCardsFromPlayer(player, cards) {
        player.cards = player.cards.filter(card => !cards.some(playedCard => playedCard.value === card.value &&
            playedCard.type === card.type));
    }
    updateGameState(game) {
        this.checkWinningConditions(game);
        this.updateTurn(game);
        this.games.set(game.roomId, game);
    }
    checkWinningConditions(game) {
        for (const player of game.players) {
            if (card_validator_1.CardValidator.checkGameTangan(player.cards)) {
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
    updateTurn(game) {
        if (game.status === 'FINISHED')
            return;
        let nextTurn = (game.currentTurn + 1) % game.players.length;
        while (!game.players[nextTurn].isAlive) {
            nextTurn = (nextTurn + 1) % game.players.length;
        }
        game.currentTurn = nextTurn;
    }
    generateDeck() {
        const deck = [];
        for (let set = 0; set < 2; set++) {
            Object.values(card_interface_1.CardType).forEach(type => {
                Object.values(card_interface_1.CardValue).forEach(value => {
                    if (value !== card_interface_1.CardValue.JOKER) {
                        deck.push({ type, value, isJoker: false });
                    }
                });
            });
        }
        for (let i = 0; i < 8; i++) {
            deck.push({ value: card_interface_1.CardValue.JOKER, isJoker: true });
        }
        return this.shuffleDeck(deck);
    }
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
    getPublicGameState(game) {
        return Object.assign(Object.assign({}, game), { players: game.players.map(player => (Object.assign(Object.assign({}, player), { cards: player.cards.map(card => (Object.assign(Object.assign({}, card), { isHidden: true }))) }))) });
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], GameService);
//# sourceMappingURL=game.service.js.map