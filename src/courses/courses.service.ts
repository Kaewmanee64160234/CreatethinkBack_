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
    //create course
    const course = new Course();
    course.id = createCourseDto.id;
    course.name = createCourseDto.name;
    course.credit = createCourseDto.credit;
    course.session = createCourseDto.session;
    course.amount = createCourseDto.amount;
    course.timeIn = createCourseDto.timeIn;
    course.timeOut = createCourseDto.timeOut;
    course.fullScore = createCourseDto.fullScore;

    const courseSave = await this.courseRepository.save(course);
    //check if user exists

    const user = await this.userRepository.findOne({
      where: { id: createCourseDto.userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    courseSave.user = user;

    //create enrollment
    const enrollment = new Enrollment();
    enrollment.course = courseSave;
    enrollment.user = courseSave.user;
    await this.enrollmentRepository.save(enrollment);
    await this.courseRepository.save(courseSave);
    return this.courseRepository.findOne({
      where: { id: courseSave.id },
      relations: ['user', 'enrollment', 'enrollment.user', 'enrollment.course'],
    });
  }

  findAll() {
    return this.courseRepository.find({
      relations: ['user', 'enrollment', 'enrollment.user', 'enrollment.course'],
    });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: id },
      relations: ['user', 'enrollment', 'enrollment.user', 'enrollment.course'],
    });
    if (!course) {
      throw new NotFoundException('course not found');
    } else {
      return course;
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOneBy({ id: id });
    if (!course) {
      throw new NotFoundException('course not found');
    }
    return await this.courseRepository.save({
      ...course,
      ...updateCourseDto,
    });
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOneBy({ id: id });
    if (!course) {
      throw new NotFoundException('course not found');
    }
    return this.courseRepository.softRemove(course);
  }
}
