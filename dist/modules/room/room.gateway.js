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
exports.RoomGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const room_service_1 = require("./room.service");
const common_1 = require("@nestjs/common");
const ws_jwt_guard_1 = require("../auth/guards/ws-jwt.guard");
let RoomGateway = class RoomGateway {
    constructor(roomService) {
        this.roomService = roomService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleCreateRoom(client, payload) {
        const room = this.roomService.createRoom(client.data.userId, client.data.username, { roomName: payload.roomName, password: payload.password });
        await client.join(room.id);
        this.server.emit('room:list:updated');
        this.server.to(room.id).emit('room:created', room);
        return room;
    }
    async handleJoinRoom(client, payload) {
        const room = this.roomService.joinRoom(payload.roomId, client.data.userId, client.data.username, { password: payload.password });
        await client.join(room.id);
        this.server.emit('room:list:updated');
        this.server.to(room.id).emit('room:updated', room);
        return room;
    }
    async handleLeaveRoom(client, payload) {
        const room = this.roomService.leaveRoom(payload.roomId, client.data.userId);
        await client.leave(payload.roomId);
        this.server.emit('room:list:updated');
        if (room) {
            this.server.to(payload.roomId).emit('room:updated', room);
        }
        return { success: true };
    }
    async handleToggleReady(client, payload) {
        const room = this.roomService.toggleReady(payload.roomId, client.data.userId);
        this.server.to(room.id).emit('room:updated', room);
        if (this.roomService.isRoomReady(room.id)) {
            this.server.to(room.id).emit('room:ready', room);
        }
        return room;
    }
};
exports.RoomGateway = RoomGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomGateway.prototype, "handleToggleReady", null);
exports.RoomGateway = RoomGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomGateway);
//# sourceMappingURL=room.gateway.js.map