import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
@Entity()
export class Course {
  @PrimaryColumn({ name: 'coursesId' })
  id: string;

  @Column({ name: 'nameCourses' })
  name: string;

  @Column({ name: 'credit' })
  credit: number;

  @Column({ name: 'session' })
  session: string;

  @Column({ name: 'stdAmount' })
  amount: number;

  @Column({ name: 'timeIn' })
  timeIn: Date;

  @Column({ name: 'timeOut' })
  timeOUt: Date;

  @Column({ name: 'fullScores' })
  fullScore: number;

  @ManyToOne(() => User, (user) => user.course)
  @JoinColumn()
  user: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
