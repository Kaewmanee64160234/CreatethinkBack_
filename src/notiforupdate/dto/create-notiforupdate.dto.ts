import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateNotiforupdateDto {
  @IsOptional()
  image1?: string;

  @IsOptional()
  image2?: string;

  @IsOptional()
  image3?: string;

  @IsOptional()
  image4?: string;

  @IsOptional()
  image5?: string;

  @IsNotEmpty()
  @IsString()
  faceDescriptor1: string;

  faceDescriptor2?: string;

  faceDescriptor3?: string;

  faceDescriptor4?: string;

  faceDescriptor5?: string;

  @IsNotEmpty()
  @IsNumber() // Changed to @IsNumber() for userId
  userId: number;

  @IsOptional()
  teacherId?: string;

  @IsOptional()
  userRecieve?: string;
}
