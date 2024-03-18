import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { Student } from './students/entities/student.entity';
import { User } from './users/entities/user.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { Classroom } from './classrooms/entities/classroom.entity';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';

@Module({
  imports: [
    StudentsModule,
    UsersModule,
    TeachersModule,
    ClassroomsModule,
    CoursesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'creativethinking',
      entities: [Student, User, Teacher, Classroom, Course],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
