import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Teacher {
  @PrimaryGeneratedColumn()
  teacherId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;
}
