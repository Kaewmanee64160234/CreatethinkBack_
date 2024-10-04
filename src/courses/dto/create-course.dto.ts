import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  coursesId: string;

  @IsNotEmpty()
  nameCourses: string;

  @IsNotEmpty()
  typeCourses: string;

  @IsNotEmpty()
  credit: number;

  @IsNotEmpty()
  session: string;

  @IsNotEmpty()
  dayInLab: string;

  @IsNotEmpty()
  dayInLec: string;

  @IsNotEmpty()
  timeInLab: string;

  @IsNotEmpty()
  timeOutLab: string;

  @IsNotEmpty()
  timeInLec: string;

  @IsNotEmpty()
  timeOutLec: string;

  @IsNotEmpty()
  fullScore: number;

  @IsNotEmpty()
  userId: number;
}
