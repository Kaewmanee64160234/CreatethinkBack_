import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'attendanceId' })
  id: number;

  @Column({ name: 'attendanceDate' })
  date: Date;

  @Column({ name: 'status' })
  status: string;
}
