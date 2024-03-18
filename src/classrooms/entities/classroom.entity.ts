import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn({ name: 'classId' })
  id: number;

  @Column()
  classroomId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  studentAmount: number;
}
