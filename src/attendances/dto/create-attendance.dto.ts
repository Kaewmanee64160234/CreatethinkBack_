import { IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  attendanceStatus: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
<<<<<<< HEAD
  user: User[];
  assignment: any;
=======
  assignmentId: number;
>>>>>>> 39859d4b1b9e86240f7f77e43456331e8f419301
}
