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
  @PrimaryColumn()
  coursesId: string;

  @Column()
  nameCourses: string;

  @Column()
  typeCourses: string;

  @Column()
  credit: number;

  @Column()
  session: string;

  @Column()
  dayInLab: string;

  @Column()
  dayInLec: string;

  @Column()
  timeInLab: string;

  @Column()
  timeOutLab: string;

  @Column()
  timeInLec: string;

  @Column()
  timeOutLec: string;

  @Column()
  fullScore: number;

  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn()
  user: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, {
    cascade: true,
  })
  enrollments: Enrollment[];

  @OneToMany(() => Assignment, (assignment) => assignment.course, {
    cascade: true,
  })
  assignments: Assignment[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
