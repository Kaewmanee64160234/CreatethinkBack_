import { IsNotEmpty } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  courseId: string;

  user?: User; // User id
  course?: Course;
}
