import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  user: User[];
  assignment: any;
}
