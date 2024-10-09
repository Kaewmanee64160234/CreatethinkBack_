import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  // @IsNotEmpty()
  role: string;

  // @IsNotEmpty()
  status: string;

  studentId?: string;

  teacherId?: string;

  // adminId: string;

  year?: string;

  major?: string;

  countingRejection?: number;

  registerStatus: string;

  faceDescription1?: string;

  faceDescription2?: string;

  faceDescription3?: string;

  faceDescription4?: string;

  faceDescription5?: string;

  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
}
