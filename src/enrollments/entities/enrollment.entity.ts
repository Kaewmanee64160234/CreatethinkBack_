import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn({ name: 'enrollmentId' })
  id: number;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course[];

  @ManyToOne(() => User, (user) => user.enrollment)
  user: User[];
}
