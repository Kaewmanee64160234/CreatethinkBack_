import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  attendanceId: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  attendanceDate: Date;

  @Column()
  attendanceStatus: string;

  @Column({ default: 'noimage.jpg' })
  attendanceImage: string;

  @Column()
  attendanceConfirmStatus: string;

  @ManyToOne(() => User, (user) => user.attendance, { nullable: true })
  user: User | null;

  @ManyToOne(() => Assignment, (assignment) => assignment.attendances)
  assignment: Assignment;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
