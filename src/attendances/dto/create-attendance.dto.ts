import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  attendanceStatus: string;

  userId: number;

  @IsNotEmpty()
  assignmentId: number;

  @IsNotEmpty()
  attendanceConfirmStatus: string;

  user: User;
}
