/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Buffer } from 'buffer';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import path, { extname, join } from 'path';
import { promises as fsPromises, renameSync } from 'fs';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    try {
      console.log('Received DTO:', createAttendanceDto);
      const assignment = await this.assignmentRepository.findOne({
        where: { assignmentId: createAttendanceDto.assignmentId },
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      const newAttendance = new Attendance();
      newAttendance.user =
        createAttendanceDto.user === null
          ? null
          : await this.userRepository.findOne({
              where: { studentId: createAttendanceDto.studentId + '' },
            });
      newAttendance.attendanceDate = new Date();
      newAttendance.attendanceImage =
        createAttendanceDto.attendanceImage || 'default-image.jpg';
      newAttendance.attendanceConfirmStatus =
        createAttendanceDto.attendanceConfirmStatus;
      newAttendance.attendanceScore = createAttendanceDto.attendanceScore;

      const currentDate = new Date();
      const assignmentDate = new Date(assignment.assignMentTime);
      newAttendance.attendanceStatus = createAttendanceDto.attendanceStatus;
      newAttendance.assignment = assignment;

      return this.attendanceRepository.save(newAttendance);
    } catch (error) {
      console.error('Error in create attendance:', error);
      throw new Error('Error creating attendance');
    }
  }

  findAll() {
    return this.attendanceRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOneBy({
      attendanceId: id,
    });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    } else {
      return attendance;
    }
  }

  async remove(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendanceId: id },
      relations: ['user', 'assignment', 'assignment.course'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    // Remove image
    const imagePath = join('./', 'attendance_image');
    const image = attendance.attendanceImage;
    const imageFullPath = join(imagePath, image);

    try {
      await fsPromises.unlink(imageFullPath);
    } catch (error) {
      console.error('Error removing image:', error);
    }

    const userDelete = await this.attendanceRepository.softRemove(attendance);

    // Get all users who have attendance for this assignment
    const usersInAttendance = await this.attendanceRepository.find({
      where: {
        assignment: { assignmentId: attendance.assignment.assignmentId },
      },
      relations: ['user'],
    });
    console.log(usersInAttendance);

    // Extract user IDs from the attendance records
    const usersInAttendanceIds = new Set(
      usersInAttendance.map((a) => a.user.userId),
    );

    // Get all users enrolled in the course
    const usersInCourse = await this.enrollmentRepository.find({
      where: { course: { coursesId: attendance.assignment.course.coursesId } },
      relations: ['user'],
    });

    // Extract user objects from the enrollment records
    const usersInCourseList = usersInCourse.map(
      (enrollment) => enrollment.user,
    );

    // Find users who are in the course but not in the attendance records
    const usersToCreateAttendance = usersInCourseList.filter(
      (user) => !usersInAttendanceIds.has(user.userId),
    );

    // Create attendance records for users without existing records
    for (const user of usersToCreateAttendance) {
      const newAttendance = new Attendance();
      newAttendance.user = user;
      newAttendance.assignment = attendance.assignment;
      newAttendance.attendanceDate = new Date();
      newAttendance.attendanceStatus = 'absent';
      newAttendance.attendanceConfirmStatus = 'notconfirm';
      newAttendance.attendanceImage = 'noimage.jpg';

      await this.attendanceRepository.save(newAttendance);
    }

    return userDelete;
  }

  //getAttendanceBy AssignmentId
  async getAttendanceByAssignmentId(assignmentId: number) {
    try {
      const attendances = await this.attendanceRepository.find({
        where: { assignment: { assignmentId: assignmentId } },
        relations: ['user'],
      });
      if (!attendances) {
        throw new NotFoundException('attendances not found');
      } else {
        console.log(attendances.length);
        return attendances;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //update
  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      console.log(id);

      const user = await this.userRepository.findOne({
        where: { studentId: updateAttendanceDto.studentId },
      });
      const attendance = await this.attendanceRepository.findOne({
        where: {
          attendanceId: id,
        },
      });
      if (
        attendance != null &&
        (attendance.attendanceStatus !== 'present' ||
          attendance.attendanceConfirmStatus == 'recheck') &&
        attendance.attendanceStatus !== 'absent'
      ) {
        // send nopermition exeption 403

        throw new HttpErrorByCode[403]('You do not have permission to update');
      } else {
        console.log('attendanceUpdate', updateAttendanceDto);

        const attendance_ = await this.attendanceRepository.findOne({
          where: {
            attendanceId: id,
            assignment: { assignmentId: +updateAttendanceDto.assignmentId },
            user: { studentId: updateAttendanceDto.studentId },
          },
        });
        console.log('attendance_', attendance_);

        attendance_.attendanceConfirmStatus =
          updateAttendanceDto.attendanceConfirmStatus;
        attendance_.attendanceStatus = updateAttendanceDto.attendanceStatus;
        if (attendance_.attendanceImage === 'noimage.jpg') {
          attendance_.attendanceImage = updateAttendanceDto.attendanceImage;
        }
        attendance_.attendanceScore = updateAttendanceDto.attendanceScore;

        attendance_.user = user;
        //'if in time' 15 min late set attendanceStatus to 'late'
        const currentDate = new Date();
        const assignmentDate = new Date(updateAttendanceDto.assignMentTime);
        const diff = Math.abs(currentDate.getTime() - assignmentDate.getTime());
        attendance_.attendanceStatus =
          Math.ceil(diff / (1000 * 60)) > 2 ? 'late' : 'present';

        const attSave = await this.attendanceRepository.save(attendance_);
        console.log('attSave', attSave);
        return attSave;
      }
    } catch (error) {
      console.log('--------------');
      console.log(error);
    }

    // console.log(updateAttendanceDto);
  }

  // update by teacher
  async updateByTeacher(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId: updateAttendanceDto.user.userId },
      });
      const attendance = await this.attendanceRepository.findOne({
        where: {
          user: { studentId: user.studentId },
          assignment: {
            assignmentId: updateAttendanceDto.assignment.assignmentId,
          },
        },
      });

      const attendance_ = await this.attendanceRepository.findOne({
        where: {
          assignment: { assignmentId: updateAttendanceDto.assignmentId },
          attendanceId: id,
        },
      });
      attendance_.attendanceConfirmStatus =
        updateAttendanceDto.attendanceConfirmStatus;
      attendance_.attendanceStatus = updateAttendanceDto.attendanceStatus;
      attendance_.user = user;
      attendance_.attendanceScore = updateAttendanceDto.attendanceScore;
      //'if in time' 15 min late set attendanceStatus to 'late'

      return this.attendanceRepository.save(attendance_);
    } catch (error) {
      console.log('--------------');
      console.log(error);
    }
  }

  //get attendance by status
  async getAttendanceByStatusInAssignment(assignmentId: number) {
    try {
      console.log(assignmentId);
      const attendances = await this.attendanceRepository.find({
        where: {
          attendanceConfirmStatus: In(['recheck']),
          assignment: { assignmentId: assignmentId },
        },
        relations: ['user'],
      });
      if (!attendances) {
        throw new NotFoundException('attendances not found');
      } else {
        return attendances;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //  confirmAttendance
  async confirmAttendance(id: number) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { attendanceId: id },
        relations: ['assignment'],
      });
      if (!attendance) {
        throw new NotFoundException('attendance not found');
      }
      attendance.attendanceConfirmStatus = 'confirmed';
      attendance.attendanceStatus = 'present';

      return this.attendanceRepository.save(attendance);
    } catch (error) {
      console.log(error);
    }
  }
  //rejectAttendance
  async rejectAttendance(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendanceId: id },
      relations: ['assignment'],
    });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    }
    attendance.attendanceConfirmStatus = 'confirmed';
    attendance.attendanceStatus = 'absent';
    attendance.attendanceImage = 'noimage.jpg';
    console.log(attendance);
    return this.attendanceRepository.save(attendance);
  }
  //get attendance by couse id
  async getAttendanceByCourseId(courseId: number) {
    try {
      const attendances = await this.attendanceRepository.find({
        where: { assignment: { course: { coursesId: String(courseId) } } },
        relations: ['user', 'assignment'],
      });
      if (!attendances) {
        throw new NotFoundException('attendances not found');
      } else {
        return attendances;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //check all attendance
  async checkAllAttendance(assignmentId: number) {
    // Fetch the assignment and its related course
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentId: assignmentId },
      relations: ['course'],
    });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const course = assignment.course;

    // Fetch the enrollments for the course
    const enrollments = await this.enrollmentRepository.find({
      where: { course: { coursesId: course.coursesId } },
      relations: ['user'],
    });

    if (!enrollments.length) {
      throw new NotFoundException('No enrollments found for this course');
    }

    // Loop through the enrolled students and create or update attendance records
    for (const enrollment of enrollments) {
      const student = enrollment.user;

      let attendance = await this.attendanceRepository.findOne({
        where: { user: student, assignment: assignment },
      });

      if (!attendance) {
        // Create new attendance record if not found
        attendance = new Attendance();
        attendance.user = student;
        attendance.assignment = assignment;
        attendance.attendanceDate = new Date();
        attendance.attendanceStatus = 'absent';
        attendance.attendanceConfirmStatus = 'not confirmed';
      }
      if (
        attendance.attendanceStatus === 'present' ||
        attendance.attendanceStatus === 'present'
      ) {
        // Update attendance status if it is 'present'
        attendance.attendanceStatus = 'present';
        attendance.attendanceConfirmStatus = 'confirmed';
      }

      await this.attendanceRepository.save(attendance);
    }

    console.log('All student attendance checked');
    return 'All student attendance checked';
  }

  // get attdent by assigment and student enrollment
  async getAttendanceByAssignmentAndStudent(
    assignmentId: number,
    studentId: string,
  ) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: {
          assignment: { assignmentId: assignmentId },
          user: { studentId: studentId },
        },
        relations: ['user', 'assignment'],
      });

      if (!attendance) {
        throw new NotFoundException('attendance not found');
      } else {
        return attendance;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
