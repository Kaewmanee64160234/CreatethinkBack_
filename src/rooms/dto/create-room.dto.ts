import { IsEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsEmpty()
  roomNumber: string;

  @IsEmpty()
  name: string;

  @IsEmpty()
  type: string;

  @IsEmpty()
  studentAmount: number;
}
