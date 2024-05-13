import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  coursesId: string;

  @IsNotEmpty()
  nameCourses: string;

  @IsNotEmpty()
  credit: number;

  @IsNotEmpty()
  session: string;

  @IsNotEmpty()
  stdAmount: number;

  @IsNotEmpty()
  timeInLab: Date;

  @IsNotEmpty()
  timeOutLab: Date;

  @IsNotEmpty()
  timeInLec: Date;

  @IsNotEmpty()
  timeOutLec: Date;

  @IsNotEmpty()
  fullScore: number;

  @IsNotEmpty()
  userId: number;
}
