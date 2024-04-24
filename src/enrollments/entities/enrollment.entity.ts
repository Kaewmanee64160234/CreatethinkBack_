import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn({ name: 'enrollmentId' })
  id: number;

  @ManyToOne(() => Course, (course) => course.enrollment)
  course: Course;

  @ManyToOne(() => User, (user) => user.enrollment)
  user: User;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
