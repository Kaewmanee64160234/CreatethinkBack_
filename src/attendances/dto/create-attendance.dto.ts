import { IsNotEmpty } from 'class-validator';

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
}
