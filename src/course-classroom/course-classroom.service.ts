/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseClassroomDto } from './dto/create-course-classroom.dto';
import { UpdateCourseClassroomDto } from './dto/update-course-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseClassroom } from './entities/course-classroom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseClassroomService {
  constructor(
    @InjectRepository(CourseClassroom)
    private courseClassroomRepository: Repository<CourseClassroom>,
  ) {}
  create(createCoursesClassroomDto: CreateCourseClassroomDto) {
    return this.courseClassroomRepository.save(createCoursesClassroomDto);
  }

  findAll() {
    return this.courseClassroomRepository.find();
  }

  async findOne(id: number) {
    const courseClassroom = await this.courseClassroomRepository.findOneBy({
      id: id,
    });
    if (!courseClassroom) {
      throw new NotFoundException('course classroom not found');
    } else {
      return courseClassroom;
    }
  }

  async update(id: number, updateCourseClassroomDto: UpdateCourseClassroomDto) {
    const courseClassroom = await this.courseClassroomRepository.findOneBy({
      id: id,
    });
    if (!courseClassroom) {
      throw new NotFoundException('course classroom not found');
    }
    return await this.courseClassroomRepository.save({
      ...courseClassroom,
      ...updateCourseClassroomDto,
    });
  }

  async remove(id: number) {
    const courseClassroom = await this.courseClassroomRepository.findOneBy({
      id: id,
    });
    if (!courseClassroom) {
      throw new NotFoundException('course classroom not found');
    }
    return this.courseClassroomRepository.softRemove(courseClassroom);
  }
}
