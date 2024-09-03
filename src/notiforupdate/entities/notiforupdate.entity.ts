import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notiforupdate {
  @PrimaryGeneratedColumn()
  notiforupdateId: number;

  @Column({ type: 'text', nullable: true })
  image1: string;

  @Column({ type: 'text', nullable: true })
  image2: string;

  @Column({ type: 'text', nullable: true })
  image3: string;

  @Column({ type: 'text', nullable: true })
  image4: string;

  @Column({ type: 'text', nullable: true })
  image5: string;

  @Column({ type: 'text', nullable: true })
  faceDescriptor1: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor2: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor3: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor4: string; // JSON string

  @Column({ type: 'text', nullable: true })
  faceDescriptor5: string; // JSON string

  @Column()
  statusConfirmation: string;

  userId: number;

  teacherId: string;

  userRecieve: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @ManyToOne(() => User, (user) => user.notiforupdates)
  user: User;
}
