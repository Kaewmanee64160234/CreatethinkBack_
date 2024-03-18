import { Module } from '@nestjs/common';
import { CourseClassroomService } from './course-classroom.service';
import { CourseClassroomController } from './course-classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseClassroom } from './entities/course-classroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseClassroom])],
  controllers: [CourseClassroomController],
  providers: [CourseClassroomService],
})
export class CourseClassroomModule {}
