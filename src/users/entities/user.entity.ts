import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  role: string;

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
