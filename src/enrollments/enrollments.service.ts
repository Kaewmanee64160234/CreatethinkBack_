/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  async create(createEnrollmentDto: CreateEnrollmentDto) {
    // create the enrollment with user and course
    const user = await this.userRepository.findOneBy({
      userId: createEnrollmentDto.userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const course = await this.courseRepository.findOneBy({
      coursesId: createEnrollmentDto.courseId,
    });
    if (!course) {
      throw new NotFoundException('course not found');
    }
    const enrollment = new Enrollment();
    enrollment.user = user;
    enrollment.course = course;

    const saveEnrollment = await this.enrollmentRepository.save(enrollment);

    return this.enrollmentRepository.findOne({
      where: { enrollmentId: saveEnrollment.enrollmentId },
      relations: ['user', 'course', 'course.user'],
    });
  }

  findAll() {
    return this.enrollmentRepository.find({
      relations: ['user', 'course'],
    });
  }

  async findOne(id: number) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { enrollmentId: id },
      relations: ['user', 'course'],
    });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    } else {
      return enrollment;
    }
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.enrollmentRepository.findOneBy({
      enrollmentId: id,
    });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    }
    return await this.enrollmentRepository.save({
      ...enrollment,
      ...updateEnrollmentDto,
    });
  }

  async remove(id: number) {
    const enrollment = await this.enrollmentRepository.findOneBy({
      enrollmentId: id,
    });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    }
    return this.enrollmentRepository.softRemove(enrollment);
  }

  async findCoursesByStudentId(id: string) {
    const user = await this.userRepository.findOne({
      where: { studentId: id },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const enrollment = await this.enrollmentRepository.find({
      where: { user: { userId: user.userId } },
      relations: ['course', 'course.user'],
    });
    if (!enrollment || enrollment.length === 0) {
      throw new NotFoundException('enrollment not found for this studentId');
    }
    return enrollment;
  }
}
