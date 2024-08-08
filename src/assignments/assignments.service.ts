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
import { User } from 'src/users/entities/user.entity';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

@Injectable()
export class AssignmentsService {
  //create constructor to inject assignmentRepository and courseRepository and roomRepository
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

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
    try {
      // Check if assignment exists
      const assignment = await this.assignmentRepository.findOne({
        where: { assignmentId: id },
      });

      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }

      console.log('Updating assignment:', assignment);

      // Update assignment
      const result = await this.assignmentRepository.update(
        id,
        updateAssignmentDto,
      );
      console.log('Update result:', result);

      if (result.affected === 0) {
        throw new Error('Assignment update failed');
      }

      return { message: 'Assignment updated successfully' };
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw new Error('Internal server error: ' + error.message);
    }
  }

  async remove(id: number) {
    // Check if the assignment exists
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentId: id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }
    // Fetch and delete related attendance records
    const attendances = await this.attendanceRepository.find({
      where: { assignment: { assignmentId: id } },
    });

    if (attendances.length > 0) {
      // Delete all related attendances
      for (const attendance of attendances) {
        await this.attendanceRepository.delete(attendance.attendanceId);
      }
      // Remove the old images from the assignment_images directory
      const userImagesDir = join('./', 'attendance_image');
      const imagesToDelete: string[] = [];
      for (const imageFileName of imagesToDelete) {
        try {
          await this.removeImageFile(join(userImagesDir, imageFileName));
        } catch (fileError) {
          console.error(
            `Failed to remove image file: ${imageFileName}`,
            fileError,
          );
        }
      }
    }

    // delete assigment image
    const assignmentImages = assignment.assignmentImages;
    const assignmentImagesDir = join('./', 'assignment_images');
    const imagesToDelete: string[] = assignmentImages;
    for (const imageFileName of imagesToDelete) {
      try {
        await this.removeImageFile(join(assignmentImagesDir, imageFileName));
      } catch (fileError) {
        console.error(
          `Failed to remove image file: ${imageFileName}`,
          fileError,
        );
      }
    }

    // Now delete the assignment itself
    await this.assignmentRepository.delete(id);

    return { message: 'Assignment deleted successfully' };
  }
  private async removeImageFile(filePath: string): Promise<void> {
    try {
      await fsPromises.unlink(filePath);
      console.log(`Removed file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to remove file at path: ${filePath}`, error);
      throw new Error(`Failed to remove file: ${filePath}`);
    }
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
