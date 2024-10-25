import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from 'src/users/entities/user.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { EmailModule } from 'src/emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, User, Assignment, Enrollment]),
    EmailModule,
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService],
  exports: [AttendancesService],
})
export class AttendancesModule {}
