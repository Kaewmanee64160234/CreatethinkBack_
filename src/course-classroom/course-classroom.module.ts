import { Module } from '@nestjs/common';
import { CourseClassroomService } from './course-classroom.service';
import { CourseClassroomController } from './course-classroom.controller';

@Module({
  controllers: [CourseClassroomController],
  providers: [CourseClassroomService],
})
export class CourseClassroomModule {}
