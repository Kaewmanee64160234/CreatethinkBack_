import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateAttendanceDto {
  studentId: string;
  attendanceImage: string;
  attendanceConfirmStatus: string;
  attendanceScore: number;
  attendanceStatus: string;
  assignmentId: number;
  assignment: Assignment | null;
  user: User | null;
}
