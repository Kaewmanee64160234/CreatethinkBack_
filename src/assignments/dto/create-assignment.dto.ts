import { IsNotEmpty } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  nameAssignment: string;

  @IsNotEmpty()
  roomId: number;

  @IsNotEmpty()
  courseId: string;
}
