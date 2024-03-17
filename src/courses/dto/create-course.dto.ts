import { IsNotEmpty } from 'class-validator';
export class CreateCourseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  credit: number;

  @IsNotEmpty()
  session: string;

  @IsNotEmpty()
  fullscore: number;
}
