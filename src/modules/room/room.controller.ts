import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Controller('room')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  createRoom(
    @Request() req,
    @Body() createRoomDto: CreateRoomDto
  ) {
    return this.roomService.createRoom(req.user.userId, req.user.username, createRoomDto);
  }

  @Post(':roomId/join')
  joinRoom(
    @Request() req,
    @Param('roomId') roomId: string,
    @Body() joinRoomDto: JoinRoomDto
  ) {
    return this.roomService.joinRoom(roomId, req.user.userId, req.user.username, joinRoomDto);
  }

  @Delete(':roomId/leave')
  leaveRoom(
    @Request() req,
    @Param('roomId') roomId: string
  ) {
    return this.roomService.leaveRoom(roomId, req.user.userId);
  }

  @Put(':roomId/ready')
  toggleReady(
    @Request() req,
    @Param('roomId') roomId: string
  ) {
    return this.roomService.toggleReady(roomId, req.user.userId);
  }

  @Get(':roomId')
  getRoom(@Param('roomId') roomId: string) {
    return this.roomService.getRoomById(roomId);
  }

  @Get()
  getAvailableRooms() {
    return this.roomService.getAvailableRooms();
  }
}