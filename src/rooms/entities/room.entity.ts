import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Room {
  @PrimaryGeneratedColumn({ name: 'roomId' })
  id: number;

  @Column()
  roomNumber: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  studentAmount: number;
}
