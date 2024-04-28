import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Room, Course, Attendance])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
