import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlayerService } from './player.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('player')
@UseGuards(JwtAuthGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.playerService.getProfile(req.user.userId);
  }

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.playerService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.playerService.getStats(req.user.userId);
  }
}