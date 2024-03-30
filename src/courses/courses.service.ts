/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  create(createCourseDto: CreateCourseDto) {
    return this.courseRepository.save(createCourseDto);
  }

  findAll() {
    return this.courseRepository.find();
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOneBy({});
    if (!course) {
      throw new NotFoundException('course not found');
    } else {
      return course;
    }
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOneBy({});
    if (!course) {
      throw new NotFoundException('course not found');
    }
    return await this.courseRepository.save({
      ...course,
      ...updateCourseDto,
    });
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOneBy({});
    if (!course) {
      throw new NotFoundException('course not found');
    }
    return this.courseRepository.softRemove(course);
  }
}
