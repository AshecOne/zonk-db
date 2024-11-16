import { Controller, Post, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameService } from './game.service';
import { GameActionDto } from './dto/game-action.dto';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post(':roomId/start')
  async startGame(@Param('roomId') roomId: string) {
    return this.gameService.initializeGame(roomId);
  }

  @Post(':roomId/action')
  async gameAction(
    @Request() req,
    @Param('roomId') roomId: string,
    @Body() actionDto: GameActionDto
  ) {
    switch (actionDto.actionType) {
      case 'DASAR':
        return this.gameService.playDasar(roomId, req.user.userId, actionDto.cards);
      case 'TRIPLE':
        return this.gameService.playTriple(roomId, req.user.userId, actionDto.cards);
      case 'CONNECT':
        return this.gameService.connectToDasar(
          roomId,
          req.user.userId,
          actionDto.dasarIndex,
          actionDto.cards
        );
      default:
        throw new BadRequestException('Invalid action type');
    }
  }
}