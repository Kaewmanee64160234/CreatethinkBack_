import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  attendanceId: number;

  @Column()
  attendanceDate: Date;

  @Column()
  attendanceStatus: string;

  @ManyToOne(() => User, (user) => user.attendance)
  user: User;

  @ManyToOne(() => Assignment, (assignment) => assignment.attendances)
  assignment: Assignment;
}
