import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, Room, Course, Attendance, User]),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
