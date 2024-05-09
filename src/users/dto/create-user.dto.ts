import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  role: string;

  status: string;

  studentId: string;

  teacherId: string;

  faceDescription1: string;

  faceDescription2: string;

  faceDescription3: string;

  faceDescription4: string;

  faceDescription5: string;

  @IsNotEmpty()
  imageProfile: string;
}
