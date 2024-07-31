import { IsNotEmpty, IsOptional } from 'class-validator';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  attendanceStatus: string;

  userId: number;

  studentId: number;
  @IsNotEmpty()
  assignmentId: number;

  @IsNotEmpty()
  attendanceConfirmStatus: string;

  user: User;
  assignment: Assignment;
  attendanceId: number;
  @IsOptional()
  attendanceImage?: string;
}
