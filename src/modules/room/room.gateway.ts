import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { RoomService } from './room.service';
  import { UseGuards } from '@nestjs/common';
  import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  @UseGuards(WsJwtGuard)
  export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly roomService: RoomService) {}
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      // Handle any active rooms the client was in
      // Implementation depends on how you're tracking socket-to-room relationships
    }
  
    @SubscribeMessage('room:create')
    async handleCreateRoom(client: Socket, payload: { roomName: string; password?: string }) {
      const room = this.roomService.createRoom(
        client.data.userId,
        client.data.username,
        { roomName: payload.roomName, password: payload.password }
      );
      
      await client.join(room.id);
      this.server.emit('room:list:updated');
      this.server.to(room.id).emit('room:created', room);
      
      return room;
    }
  
    @SubscribeMessage('room:join')
    async handleJoinRoom(client: Socket, payload: { roomId: string; password?: string }) {
      const room = this.roomService.joinRoom(
        payload.roomId,
        client.data.userId,
        client.data.username,
        { password: payload.password }
      );
      
      await client.join(room.id);
      this.server.emit('room:list:updated');
      this.server.to(room.id).emit('room:updated', room);
      
      return room;
    }
  
    @SubscribeMessage('room:leave')
    async handleLeaveRoom(client: Socket, payload: { roomId: string }) {
      const room = this.roomService.leaveRoom(payload.roomId, client.data.userId);
      
      await client.leave(payload.roomId);
      this.server.emit('room:list:updated');
      
      if (room) {
        this.server.to(payload.roomId).emit('room:updated', room);
      }
      
      return { success: true };
    }
  
    @SubscribeMessage('room:ready')
    async handleToggleReady(client: Socket, payload: { roomId: string }) {
      const room = this.roomService.toggleReady(payload.roomId, client.data.userId);
      
      this.server.to(room.id).emit('room:updated', room);
      
      // Check if room is ready to start game
      if (this.roomService.isRoomReady(room.id)) {
        this.server.to(room.id).emit('room:ready', room);
      }
      
      return room;
    }
  }