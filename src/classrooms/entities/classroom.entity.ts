import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn({ name: 'classroomId' })
  id: number;
}
