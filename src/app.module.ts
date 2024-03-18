import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { TeachersModule } from './teachers/teachers.module';
import { Student } from './students/entities/student.entity';
import { User } from './users/entities/user.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/entities/room.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CourseClassroomModule } from './course-classroom/course-classroom.module';
import { AttendancesModule } from './attendances/attendances.module';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { CourseClassroom } from './course-classroom/entities/course-classroom.entity';

@Module({
  imports: [
    StudentsModule,
    UsersModule,
    TeachersModule,
    CoursesModule,
    RoomsModule,
    CoursesModule,
    EnrollmentsModule,
    CourseClassroomModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'creativethinking',
      entities: [
        Student,
        User,
        Teacher,
        Course,
        Room,
        Enrollment,
        CourseClassroom,
      ],
      synchronize: true,
    }),
    CoursesModule,
    EnrollmentsModule,
    CourseClassroomModule,
    AttendancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
