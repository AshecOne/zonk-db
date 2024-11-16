import { IsString, IsOptional, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @Length(3, 20)
  roomName: string;

  @IsOptional()
  @IsString()
  password?: string;
}