import { IsNotEmpty } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';

export class CreateAssignmentDto {
  @IsNotEmpty()
  nameAssignment: string;
  coursesId: string;
  // @IsNotEmpty()
  date: Date;

  // @IsNotEmpty()
  courseId: string;

  roomId: number;
  course: Course;

  statusAssignment: string;
  assignmentImages: string[];
}
