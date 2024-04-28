import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';
<<<<<<< HEAD
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
=======
import { Room } from 'src/rooms/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
>>>>>>> 39859d4b1b9e86240f7f77e43456331e8f419301
} from 'typeorm';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  assignmentId: number;

  @Column()
  nameAssignment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignMentTime: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.assignment)
<<<<<<< HEAD
  attendance: Attendance[];

  @ManyToMany(() => Course, (course) => course.assignment)
  course: Course[];
=======
  attendances: Attendance[];

  @ManyToOne(() => Room, (room) => room.assignments)
  room: Room;

  @ManyToOne(() => Course, (course) => course.assignments)
  course: Course;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
>>>>>>> 39859d4b1b9e86240f7f77e43456331e8f419301
}
