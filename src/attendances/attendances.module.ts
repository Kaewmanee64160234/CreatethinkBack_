import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from 'src/users/entities/user.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, User, Assignment])],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}
