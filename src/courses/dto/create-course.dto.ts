import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  credit: number;

  @IsNotEmpty()
  session: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  timeIn: Date;

  @IsNotEmpty()
  timeOut: Date;

  @IsNotEmpty()
  fullScore: number;

  @IsNotEmpty()
  userId: number;
}
