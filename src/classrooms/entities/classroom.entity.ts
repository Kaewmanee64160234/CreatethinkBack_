import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Classroom {
  @PrimaryGeneratedColumn()
  classId: number;

  @Column()
  classroomId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  studentAmount: number;
}
