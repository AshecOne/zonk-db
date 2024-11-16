import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    createRoom(req: any, createRoomDto: CreateRoomDto): import("./interfaces/room.interface").Room;
    joinRoom(req: any, roomId: string, joinRoomDto: JoinRoomDto): import("./interfaces/room.interface").Room;
    leaveRoom(req: any, roomId: string): import("./interfaces/room.interface").Room;
    toggleReady(req: any, roomId: string): import("./interfaces/room.interface").Room;
    getRoom(roomId: string): import("./interfaces/room.interface").Room;
    getAvailableRooms(): import("./interfaces/room.interface").Room[];
}
