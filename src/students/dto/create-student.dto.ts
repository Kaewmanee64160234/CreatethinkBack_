import { IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  email: string;
}
