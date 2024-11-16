import { IsString, IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Card, CardType, CardValue } from '../interfaces/card.interface';

export class CardDto {
  @IsOptional()
  @IsString()
  type?: CardType;

  @IsString()
  value: CardValue;

  @IsOptional()
  isJoker: boolean;

  @IsOptional()
  isHidden?: boolean;
}

export class GameActionDto {
  @IsString()
  roomId: string;

  @IsString()
  actionType: 'DASAR' | 'TRIPLE' | 'CONNECT';

  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards: CardDto[];

  @IsNumber()
  @IsOptional()
  dasarIndex?: number;
}