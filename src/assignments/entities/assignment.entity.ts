import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  assignmentId: number;

  @Column()
  nameAssignment: string;

  // assignment status
  @Column()
  statusAssignment: string;

  // assigment attay string assigment Imagse
  @Column('simple-array')
  assignmentImages: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignMentTime: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.assignment)
  attendances: Attendance[];

  @ManyToOne(() => Course, (course) => course.assignments)
  course: Course;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
