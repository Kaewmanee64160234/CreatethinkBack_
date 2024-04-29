import { IsNotEmpty } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  nameAssignment: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  id: number;

  roomId: number;
}
