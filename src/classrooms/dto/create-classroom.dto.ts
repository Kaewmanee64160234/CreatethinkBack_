import { IsNotEmpty } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  classroomId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  studentAmount: number;
}
