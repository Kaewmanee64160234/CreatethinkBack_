import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column()
  status: string;

  @Column()
  studentId: string;

  @Column()
  teacherId: string;

  @Column()
  faceDescription1: string;

  @Column()
  faceDescription2: string;

  @Column()
  faceDescription3: string;

  @Column()
  faceDescription4: string;

  @Column()
  faceDescription5: string;

  @Column()
  profileImage: string;

  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendance: Attendance[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
