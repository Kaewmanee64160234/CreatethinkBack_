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
  status: string;

  studentId: string;

  teacherId: string;

  faceDescription1: number;

  faceDescription2: number;

  faceDescription3: number;

  faceDescription4: number;

  faceDescription5: number;

  image1: string;

  image2: string;

  image3: string;

  image4: string;

  image5: string;
}
