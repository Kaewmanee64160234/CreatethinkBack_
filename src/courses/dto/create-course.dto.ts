import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  nameCourses: string;

  @IsNotEmpty()
  credit: number;

  @IsNotEmpty()
  session: string;

  @IsNotEmpty()
  stdAmount: number;

  @IsNotEmpty()
  timeIn: Date;

  @IsNotEmpty()
  timeOut: Date;

  @IsNotEmpty()
  fullScore: number;

  @IsNotEmpty()
  userId: number;
}
