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

  // @Column({ type: 'json', nullable: true })
  // faceDescription1: number;

  // @Column({ type: 'json', nullable: true })
  // faceDescription2: number;

  // @Column({ type: 'json', nullable: true })
  // faceDescription3: number;

  // @Column({ type: 'json', nullable: true })
  // faceDescription4: number;

  // @Column({ type: 'json', nullable: true })
  // faceDescription5: number;

  @Column({ type: 'text', default: 'no-image.jpg', nullable: true })
  image1: string;

  // @Column({ type: 'text', default: 'no-image.jpg', nullable: true })
  // image2: string;

  // @Column({ type: 'text', default: 'no-image.jpg', nullable: true })
  // image3: string;

  // @Column({ type: 'text', default: 'no-image.jpg', nullable: true })
  // image4: string;

  // @Column({ type: 'text', default: 'no-image.jpg', nullable: true })
  // image5: string;

  @Column({ type: 'text', default: 'no-image.jpg', nullable: true })
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
