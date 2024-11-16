import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
export declare class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomService;
    server: Server;
    constructor(roomService: RoomService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleCreateRoom(client: Socket, payload: {
        roomName: string;
        password?: string;
    }): Promise<import("./interfaces/room.interface").Room>;
    handleJoinRoom(client: Socket, payload: {
        roomId: string;
        password?: string;
    }): Promise<import("./interfaces/room.interface").Room>;
    handleLeaveRoom(client: Socket, payload: {
        roomId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleToggleReady(client: Socket, payload: {
        roomId: string;
    }): Promise<import("./interfaces/room.interface").Room>;
}
