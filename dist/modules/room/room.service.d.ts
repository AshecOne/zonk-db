import { Room } from './interfaces/room.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
export declare class RoomService {
    private rooms;
    createRoom(hostId: string, username: string, createRoomDto: CreateRoomDto): Room;
    joinRoom(roomId: string, playerId: string, username: string, joinRoomDto: JoinRoomDto): Room;
    leaveRoom(roomId: string, playerId: string): Room;
    toggleReady(roomId: string, playerId: string): Room;
    getRoomById(roomId: string): Room;
    getAvailableRooms(): Room[];
    isRoomReady(roomId: string): boolean;
    private getPublicRoomData;
}
