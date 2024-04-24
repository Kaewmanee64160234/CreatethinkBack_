/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  async create(createAssignmentDto: CreateAssignmentDto) {
    const assignment = new Assignment();
    assignment.id = createAssignmentDto.id;
    assignment.name = createAssignmentDto.name;
    assignment.date = createAssignmentDto.date;

    const course = await this.courseRepository.findOneBy({
      id: createAssignmentDto.courseId,
    });
    if (!course) {
      throw new NotFoundException('course not found');
    }
    assignment.course = course[0];
    return this.assignmentRepository.save(assignment);
  }
  findAll() {
    return `This action returns all assignments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignment`;
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignment`;
  }
}
