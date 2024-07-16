import { IsNotEmpty } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';

export class CreateAssignmentDto {
  @IsNotEmpty()
  nameAssignment: string;

  // @IsNotEmpty()
  date: Date;

  // @IsNotEmpty()
  courseId: string;

  roomId: number;
  course: Course;
}
