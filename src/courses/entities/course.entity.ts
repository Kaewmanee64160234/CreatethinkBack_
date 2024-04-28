import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Course {
  @PrimaryColumn({ name: 'coursesId' })
  coursesId: string;

  @Column({ name: 'nameCourses' })
  name: string;

  @Column({ name: 'credit' })
  credit: number;

  @Column({ name: 'session' })
  session: string;

  @Column({ name: 'stdAmount' })
  amount: number;

  @Column({ type: 'time', name: 'timeIn' })
  timeIn: Date;

  @Column({ type: 'time', name: 'timeOut' })
  timeOut: Date;

  @Column({ name: 'fullScores' })
  fullScore: number;

  @ManyToOne(() => User, (user) => user.course)
  @JoinColumn()
  user: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollment: Enrollment[];

  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignments: Assignment[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
