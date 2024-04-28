import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Room } from 'src/rooms/entities/room.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn({ name: 'assignmentId' })
  assignmentId: number;

  @Column({ name: 'nameAssignment' })
  nameAssignment: string;

  @Column({
    name: 'assignMentTime',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignMentTime: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.assignment)
  attendances: Attendance[];

  @ManyToOne(() => Room, (room) => room.assignments)
  room: Room;

  @ManyToOne(() => Course, (course) => course.assignments)
  course: Course;
}
