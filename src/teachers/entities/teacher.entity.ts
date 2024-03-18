import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Teacher {
  @PrimaryGeneratedColumn({ name: 'teacherId' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;
}
