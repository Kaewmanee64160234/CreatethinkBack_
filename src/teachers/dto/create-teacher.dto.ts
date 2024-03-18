import { IsNotEmpty } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;
}
