"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
let RoomService = class RoomService {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(hostId, username, createRoomDto) {
        const roomId = Math.random().toString(36).substring(7);
        const newRoom = {
            id: roomId,
            name: createRoomDto.roomName,
            hostId,
            password: createRoomDto.password,
            players: [{
                    id: hostId,
                    username,
                    isReady: false,
                    position: 0,
                    joinedAt: new Date()
                }],
            status: 'WAITING',
            createdAt: new Date(),
            updatedAt: new Date(),
            maxPlayers: 5
        };
        this.rooms.set(roomId, newRoom);
        return this.getPublicRoomData(newRoom);
    }
    joinRoom(roomId, playerId, username, joinRoomDto) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        if (room.status !== 'WAITING') {
            throw new common_1.ConflictException('Room is not available for joining');
        }
        if (room.players.length >= room.maxPlayers) {
            throw new common_1.ConflictException('Room is full');
        }
        if (room.players.find(p => p.id === playerId)) {
            throw new common_1.ConflictException('Player already in room');
        }
        if (room.password && room.password !== joinRoomDto.password) {
            throw new common_1.BadRequestException('Invalid room password');
        }
        const newPlayer = {
            id: playerId,
            username,
            isReady: false,
            position: room.players.length,
            joinedAt: new Date()
        };
        room.players.push(newPlayer);
        room.updatedAt = new Date();
        if (room.players.length === room.maxPlayers) {
            room.status = 'FULL';
        }
        this.rooms.set(roomId, room);
        return this.getPublicRoomData(room);
    }
    leaveRoom(roomId, playerId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const playerIndex = room.players.findIndex(p => p.id === playerId);
        if (playerIndex === -1) {
            throw new common_1.NotFoundException('Player not in room');
        }
        room.players = room.players.filter(p => p.id !== playerId);
        room.updatedAt = new Date();
        if (playerId === room.hostId && room.players.length > 0) {
            room.hostId = room.players[0].id;
        }
        if (room.players.length === 0) {
            this.rooms.delete(roomId);
            return null;
        }
        room.status = 'WAITING';
        this.rooms.set(roomId, room);
        return this.getPublicRoomData(room);
    }
    toggleReady(roomId, playerId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const player = room.players.find(p => p.id === playerId);
        if (!player) {
            throw new common_1.NotFoundException('Player not in room');
        }
        player.isReady = !player.isReady;
        room.updatedAt = new Date();
        this.rooms.set(roomId, room);
        return this.getPublicRoomData(room);
    }
    getRoomById(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return this.getPublicRoomData(room);
    }
    getAvailableRooms() {
        return Array.from(this.rooms.values())
            .filter(room => room.status === 'WAITING')
            .map(room => this.getPublicRoomData(room));
    }
    isRoomReady(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return room.players.length === room.maxPlayers &&
            room.players.every(player => player.isReady);
    }
    getPublicRoomData(room) {
        const { password } = room, publicRoom = __rest(room, ["password"]);
        return publicRoom;
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
//# sourceMappingURL=room.service.js.map