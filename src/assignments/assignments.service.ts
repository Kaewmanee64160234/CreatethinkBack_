/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';

@Injectable()
export class AssignmentsService {
  //create constructor to inject assignmentRepository and courseRepository and roomRepository
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}
  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    try {
      const course = await this.courseRepository.findOne({
        where: { coursesId: createAssignmentDto.coursesId },
      });

      if (!course) {
        throw new Error('Course not found');
      }

      const newAssignment = new Assignment();
      newAssignment.nameAssignment = createAssignmentDto.nameAssignment;
      newAssignment.statusAssignment = createAssignmentDto.statusAssignment;
      newAssignment.course = course;
      newAssignment.assignMentTime = new Date();
      newAssignment.assignmentImages = createAssignmentDto.assignmentImages;

      return this.assignmentRepository.save(newAssignment);
    } catch (error) {
      throw new Error('Error creating assignment: ' + error.message);
    }
  }
  findAll() {
    try {
      //find all assignments
      return this.assignmentRepository.find();
    } catch (error) {
      throw new Error('Error fetching assignments');
    }
  }

  findOne(id: number) {
    try {
      //find assignment by id
      return this.assignmentRepository.findOne({
        where: { assignmentId: id },
        relations: ['course'],
      });
    } catch (error) {
      throw new Error('Error fetching assignment');
    }
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    //check if assignment exists
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentId: id },
    });
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    //update assignment
    return this.assignmentRepository.update(id, updateAssignmentDto);
  }

  async remove(id: number) {
    //check if assignment exists
    const assignment = this.assignmentRepository.findOne({
      where: { assignmentId: id },
    });
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    //delete attendance by loop
    const attendances = await this.attendanceRepository.find({
      where: { assignment: { assignmentId: id } },
    });
    for (let i = 0; i < attendances.length; i++) {
      this.attendanceRepository.delete(attendances[i].attendanceId);
    }
    //delete assignment
    return this.assignmentRepository.delete(id);
  }
  //get Assginment by course id
  async getAssignmentByCourseId(courseId: string) {
    try {
      return this.assignmentRepository.find({
        where: {
          course: { coursesId: courseId },
          statusAssignment: 'completed',
        },

        relations: ['course', 'course.user'],
        order: { createdDate: 'desc' },
      });
    } catch (error) {
      throw new Error('Error fetching assignment');
    }
  }
}
