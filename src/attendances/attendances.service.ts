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

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
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
      newAttendance.attendanceImage = createAttendanceDto.attendanceImage;
      newAttendance.attendanceConfirmStatus =
        createAttendanceDto.attendanceConfirmStatus;
      newAttendance.attendanceImage = createAttendanceDto.attendanceImage;

      const currentDate = new Date();
      const assignmentDate = new Date(assignment.assignMentTime);
      const diff = Math.abs(currentDate.getTime() - assignmentDate.getTime());
      newAttendance.attendanceStatus =
        Math.ceil(diff / (1000 * 60)) > 15 ? 'late' : 'on time';
      newAttendance.assignment = assignment;

      return this.attendanceRepository.save(newAttendance);
    } catch (error) {
      console.error('Error in create attendance:', error);
      throw new Error('Error creating attendance');
    }
  }

  findAll() {
    return this.attendanceRepository.find();
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
    const attendance = await this.attendanceRepository.findOneBy({
      attendanceId: id,
    });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    }
    return this.attendanceRepository.softRemove(attendance);
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
    console.log(updateAttendanceDto.assignment);

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
    // console.log(updateAttendanceDto);

    if (
      attendance != null &&
      (attendance.attendanceStatus !== 'on time' ||
        attendance.attendanceConfirmStatus == 'recheck')
    ) {
      // send nopermition exeption 403

      throw new HttpErrorByCode[403]('You do not have permission to update');
    } else {
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
      return this.attendanceRepository.save(attendance_);
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
    attendance.attendanceStatus = 'on time';
    attendance.user = null;
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
  async checkAllAttendance(assigmentId: number) {
    const attendances = await this.attendanceRepository.find({
      where: {
        attendanceStatus: 'on time',
        assignment: { assignmentId: assigmentId },
      },
    });
    //loop
    attendances.forEach((attendance) => {
      attendance.attendanceStatus = 'present';
      this.attendanceRepository.save(attendance);
    });
    console.log('attendances', attendances);
    if (!attendances) {
      throw new NotFoundException('attendances not found');
    } else {
      return attendances;
    }
  }
}
