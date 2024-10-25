import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { NotiforupdateModule } from './notiforupdate/notiforupdate.module';
import { Notiforupdate } from './notiforupdate/entities/notiforupdate.entity';

@Module({
  imports: [
    // Load environment variables from .env or .env.local
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'], // Loads .env.local first, then .env if not found
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      // type: 'mysql',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: 'yourpassword',
      // database: 'creativethinking',
      type: 'mysql', // or 'postgres'
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [
        User,
        Room,
        Course,
        Enrollment,
        Attendance,
        Assignment,
        Notiforupdate,
      ],
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
    NotiforupdateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
