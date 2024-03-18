import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CourseClassroomModule } from './course-classroom/course-classroom.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'creativethinking',
      entities: [Course],
      synchronize: true,
    }),
    CoursesModule,
    EnrollmentsModule,
    CourseClassroomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
