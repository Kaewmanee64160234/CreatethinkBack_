import { Assignment } from 'src/assignments/entities/assignment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
