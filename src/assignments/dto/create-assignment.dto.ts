import { IsNotEmpty } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  nameAssignment: string;

  @IsNotEmpty()
<<<<<<< HEAD
  date: Date;

  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  id: number;
=======
  roomId: number;

  @IsNotEmpty()
  courseId: string;
>>>>>>> 39859d4b1b9e86240f7f77e43456331e8f419301
}
