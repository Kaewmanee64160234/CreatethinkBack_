import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/entities/room.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CourseClassroomModule } from './course-classroom/course-classroom.module';
import { AttendancesModule } from './attendances/attendances.module';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { CourseClassroom } from './course-classroom/entities/course-classroom.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { ClassroomsModule } from './classrooms/classrooms.module';

@Module({
  imports: [
    UsersModule,
    CoursesModule,
    RoomsModule,
    EnrollmentsModule,
    CourseClassroomModule,
    AttendancesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'creativethinking',
      entities: [User, Course, Room, Enrollment, CourseClassroom, Attendance],
      synchronize: true,
    }),
    ClassroomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
