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

  @Column({ nullable: true })
  year: string;

  @Column({ nullable: true })
  major: string;

  @Column({ type: 'text', nullable: true })
  image1: string;

  @Column({ type: 'text', nullable: true })
  image2: string;

  @Column({ type: 'text', nullable: true })
  image3: string;

  @Column({ type: 'text', nullable: true })
  image4: string;

  @Column({ type: 'text', nullable: true })
  image5: string;

  @Column({ type: 'text', nullable: true })
  faceDescriptor1: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor2: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor3: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor4: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor5: string; // JSON string

  @Column({ type: 'text', nullable: true })
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
