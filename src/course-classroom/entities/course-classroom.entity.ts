import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CourseClassroom {
  @PrimaryGeneratedColumn({ name: 'coursesClassId' })
  id: number;

  @Column({ name: 'CoursesClassType' })
  type: string;
}
