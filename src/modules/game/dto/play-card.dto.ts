import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CardDto } from './game-action.dto';

export class PlayCardDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards: CardDto[];
}