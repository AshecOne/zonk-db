import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Room, RoomPlayer } from './interfaces/room.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  createRoom(hostId: string, username: string, createRoomDto: CreateRoomDto): Room {
    const roomId = Math.random().toString(36).substring(7);
    
    const newRoom: Room = {
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

  joinRoom(roomId: string, playerId: string, username: string, joinRoomDto: JoinRoomDto): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== 'WAITING') {
      throw new ConflictException('Room is not available for joining');
    }

    if (room.players.length >= room.maxPlayers) {
      throw new ConflictException('Room is full');
    }

    if (room.players.find(p => p.id === playerId)) {
      throw new ConflictException('Player already in room');
    }

    if (room.password && room.password !== joinRoomDto.password) {
      throw new BadRequestException('Invalid room password');
    }

    const newPlayer: RoomPlayer = {
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

  leaveRoom(roomId: string, playerId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new NotFoundException('Player not in room');
    }

    room.players = room.players.filter(p => p.id !== playerId);
    room.updatedAt = new Date();

    // If host leaves, assign new host
    if (playerId === room.hostId && room.players.length > 0) {
      room.hostId = room.players[0].id;
    }

    // If room becomes empty, delete it
    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    room.status = 'WAITING';
    this.rooms.set(roomId, room);
    return this.getPublicRoomData(room);
  }

  toggleReady(roomId: string, playerId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('Player not in room');
    }

    player.isReady = !player.isReady;
    room.updatedAt = new Date();
    this.rooms.set(roomId, room);
    return this.getPublicRoomData(room);
  }

  getRoomById(roomId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return this.getPublicRoomData(room);
  }

  getAvailableRooms(): Room[] {
    return Array.from(this.rooms.values())
      .filter(room => room.status === 'WAITING')
      .map(room => this.getPublicRoomData(room));
  }

  isRoomReady(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room.players.length === room.maxPlayers && 
           room.players.every(player => player.isReady);
  }

  private getPublicRoomData(room: Room): Room {
    const { password, ...publicRoom } = room;
    return publicRoom;
  }
}