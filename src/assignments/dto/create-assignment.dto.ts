import { IsNotEmpty } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';
import { Room } from 'src/rooms/entities/room.entity';

export class CreateAssignmentDto {
  @IsNotEmpty()
  nameAssignment: string;

  // @IsNotEmpty()
  date: Date;

  // @IsNotEmpty()
  courseId: string;

  roomId: number;
  room: Room;
  course: Course;
}
