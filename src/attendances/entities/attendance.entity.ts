import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'attendanceId' })
  id: number;

  @Column({ name: 'attendanceDate' })
  date: Date;

  @Column({ name: 'status' })
  status: string;

  @ManyToOne(() => User, (user) => user.attendance)
  user: User;

  @ManyToOne(() => Assignment, (assignment) => assignment.attendance)
  assignment: Assignment;
}
