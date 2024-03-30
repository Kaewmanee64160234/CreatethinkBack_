import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  teacherId: string;

  @IsNotEmpty()
  faceDescription1: string;

  @IsNotEmpty()
  faceDescription2: string;

  @IsNotEmpty()
  faceDescription3: string;

  @IsNotEmpty()
  faceDescription4: string;

  @IsNotEmpty()
  faceDescription5: string;
}
