/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { userId: createCourseDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create course instance and set properties including the primary key
    const course = new Course();
    course.coursesId = createCourseDto.coursesId; // Set the primary key value
    course.nameCourses = createCourseDto.nameCourses;
    course.credit = createCourseDto.credit;
    course.session = createCourseDto.session;
    course.stdAmount = createCourseDto.stdAmount;
    course.timeIn = createCourseDto.timeIn;
    course.timeOut = createCourseDto.timeOut;
    course.fullScore = createCourseDto.fullScore;
    course.user = user; // Assign the user to the course

    // Save course to database
    const savedCourse = await this.courseRepository.save(course);

    return savedCourse;
  }

  findAll() {
    return this.courseRepository.find({
      // relations: ['user', 'enrollment', 'enrollment.user', 'enrollment.course'],
    });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { coursesId: id },
      relations: ['user', 'enrollment', 'enrollment.user', 'enrollment.course'],
    });
    if (!course) {
      throw new NotFoundException('course not found');
    } else {
      return course;
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOneBy({ coursesId: id });
    if (!course) {
      throw new NotFoundException('course not found');
    }
    return await this.courseRepository.save({
      ...course,
      ...updateCourseDto,
    });
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOneBy({ coursesId: id });
    if (!course) {
      throw new NotFoundException('course not found');
    }
    return this.courseRepository.softRemove(course);
  }
}
