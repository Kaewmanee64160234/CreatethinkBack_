import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @Column()
  roomNumber: string;

  @Column()
  roomType: string;

  @Column()
  studentAmount: number;
}
