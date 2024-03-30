import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
}
