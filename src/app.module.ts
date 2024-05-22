import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AttendancesModule } from './attendances/attendances.module';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { AssignmentsModule } from './assignments/assignments.module';
import { Assignment } from './assignments/entities/assignment.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/entities/room.entity';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    RoomsModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    AttendancesModule,
    AssignmentsModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'creativethinking',
      entities: [User, Room, Course, Enrollment, Attendance, Assignment],
      synchronize: true,
      // logging: true,
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
