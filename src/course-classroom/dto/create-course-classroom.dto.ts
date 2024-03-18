import { IsNotEmpty } from 'class-validator';

export class CreateCourseClassroomDto {
  @IsNotEmpty()
  type: string;
}
