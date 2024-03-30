import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
