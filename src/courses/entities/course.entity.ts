import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Course {
  @PrimaryGeneratedColumn({ name: 'coursesId' })
  id: number;

  @Column({ name: 'nameCourses' })
  name: string;

  @Column({ name: 'credit' })
  credit: number;

  @Column({ name: 'session' })
  session: string;

  @Column({ name: 'fullScores' })
  fullScore: number;
}
