import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn({ name: 'assignmentId' })
  id: number;

  @Column({ name: 'nameAssignment' })
  name: string;

  @Column({ name: 'assignMentTime' })
  date: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.assignment)
  attendance: Attendance[];

  @ManyToMany(() => Course, (course) => course.assignment)
  course: Course[];
}
