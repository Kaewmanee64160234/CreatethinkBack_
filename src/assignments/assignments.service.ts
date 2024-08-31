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
import { promises as fs } from 'fs';
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
      relations: ['attendances', 'course'], // Ensure that related attendances are loaded
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Fetch and delete related attendance records
    const attendances = await this.attendanceRepository.find({
      where: { assignment: { assignmentId: id } },
    });
    console.log('Deleting assignment:', assignment);
    console.log('Attendances:', attendances);

    if (attendances.length > 0) {
      for (const attendance of attendances) {
        // Delete attendance record
        await this.attendanceRepository.delete(attendance.attendanceId);

        // Remove the old images from the attendance_images directory
        if (attendance.attendanceImage) {
          const imagePath = join(
            './',
            'attendance_image',
            attendance.attendanceImage,
          );
          try {
            await this.removeImageFile(imagePath);
          } catch (fileError) {
            console.error(
              `Failed to remove image file: ${imagePath}`,
              fileError,
            );
          }
        }
      }
    }
    console.log('Deleting assignment:', assignment);

    // // Delete assignment images if they exist
    const assignmentImages = assignment.assignmentImages;
    if (assignmentImages && assignmentImages.length > 0) {
      const assignmentImagesDir = join('./', 'assignment_images');
      for (const imageFileName of assignmentImages) {
        const imagePath = join(assignmentImagesDir, imageFileName);
        try {
          await this.removeImageFile(imagePath);
        } catch (fileError) {
          console.error(`Failed to remove image file: ${imagePath}`, fileError);
        }
      }
    }

    // Now delete the assignment itself
    const assDelete = await this.assignmentRepository.remove(assignment);

    return assDelete;
  }

  async removeImageFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath); // Deletes the file
      console.log(`File removed: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error);
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

  // get image files from assigment id status nodata last created
  async getImageFiles(courseId: string) {
    try {
      return this.assignmentRepository.findOne({
        where: {
          course: { coursesId: courseId },
          statusAssignment: 'nodata',
        },
        order: { createdDate: 'desc' },
      });
    } catch (error) {
      throw new Error('Error fetching assignment');
    }
  }
}
