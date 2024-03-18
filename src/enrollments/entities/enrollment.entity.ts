import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn({ name: 'enrollentId' })
  id: number;
}
