import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService]
})
export class GameModule {}