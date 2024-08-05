import { IsNotEmpty, IsOptional } from 'class-validator';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  attendanceStatus: string;

  userId: number;

  studentId: string;
  @IsNotEmpty()
  assignmentId: number;
  assignMentTime: string;

  @IsNotEmpty()
  attendanceConfirmStatus: string;

  user: User;
  assignment: Assignment;
  attendanceId: number;
  @IsOptional()
  attendanceImage?: string;
  attendanceScore: number;
}
