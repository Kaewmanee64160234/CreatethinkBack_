/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class AssignmentsService {
  //create constructor to inject assignmentRepository and courseRepository and roomRepository
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}
  async create(createAssignmentDto: CreateAssignmentDto) {
    try {
      //find room and course by id
      const room = await this.roomRepository.findOne({
        where: { roomId: createAssignmentDto.roomId },
      });
      const course = await this.courseRepository.findOne({
        where: { coursesId: createAssignmentDto.courseId },
      });

      if (!room || !course) {
        throw new Error('Room or Course not found');
      }

      //create new assignment
      const newAssignment = new Assignment();
      newAssignment.nameAssignment = createAssignmentDto.nameAssignment;
      newAssignment.room = room;
      newAssignment.course = course;
      newAssignment.assignMentTime = new Date();
      //save new assignment
      return this.assignmentRepository.save(newAssignment);
    } catch (error) {
      throw new Error('Error creating assignment');
    }
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
