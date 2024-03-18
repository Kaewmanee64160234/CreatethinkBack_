import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Student {
  @PrimaryGeneratedColumn({ name: 'stdId' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  studentId: string;

  @Column()
  email: string;
}
