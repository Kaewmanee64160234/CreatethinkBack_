import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Student {
  @PrimaryGeneratedColumn({ name: 'stdId' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  studentId: string;

  @Column()
  email: string;

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn()
  user: User;
}
