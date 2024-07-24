import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AttendancesModule } from './attendances/attendances.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Course } from './courses/entities/course.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { Assignment } from './assignments/entities/assignment.entity';
import { Room } from './rooms/entities/room.entity';

@Module({
  // imports: [
  //   ConfigModule.forRoot({ isGlobal: true }),
  //   TypeOrmModule.forRootAsync({
  //     imports: [ConfigModule],
  //     useFactory: (configService: ConfigService) => ({
  //       type: 'mysql',
  //       host: configService.get<string>('DB_HOST'),
  //       port: configService.get<number>('DB_PORT'),
  //       username: configService.get<string>('DB_USERNAME'),
  //       password: configService.get<string>('DB_PASSWORD'),
  //       database: configService.get<string>('DB_DATABASE'),
  //       entities: [User, Room, Course, Enrollment, Attendance, Assignment],
  //       synchronize: true,
  //       // logging: true,
  //     }),
  //     inject: [ConfigService],
  //   }),
  //   RoomsModule,
  //   UsersModule,
  //   CoursesModule,
  //   EnrollmentsModule,
  //   AttendancesModule,
  //   AssignmentsModule,
  //   AuthModule,
  // ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      // password: 'yourpassword',
      database: 'creativethinking',
      entities: [User, Room, Course, Enrollment, Attendance, Assignment],
      synchronize: true,
      // logging: true,
    }),
    RoomsModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    AttendancesModule,
    AssignmentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
