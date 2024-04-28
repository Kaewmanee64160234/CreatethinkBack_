import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'userId' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  role: string;

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
  course: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendance: Attendance[];
}
