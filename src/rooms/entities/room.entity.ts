import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @Column()
  roomNumber: string;

  @Column()
  roomType: string;

  @Column()
  studentAttendance: number;

  @OneToMany(() => Assignment, (assignment) => assignment.room)
  assignments: Assignment[];
}
