/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Buffer } from 'buffer';

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

  async create(
    createAttendanceDto: CreateAttendanceDto,
    imageFile: Express.Multer.File,
  ) {
    try {
      if (!imageFile || !imageFile.buffer) {
        throw new Error('No file uploaded or file buffer is unavailable');
      }

      const assignment = await this.assignmentRepository.findOne({
        where: { assignmentId: createAttendanceDto.assignmentId },
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      const newAttendance = new Attendance();
      newAttendance.user = createAttendanceDto.userId
        ? await this.userRepository.findOne({
            where: { userId: createAttendanceDto.userId },
          })
        : null;

      newAttendance.attendanceDate = new Date();
      newAttendance.attendanceImage = imageFile.buffer;
      newAttendance.attendanceConfirmStatus =
        createAttendanceDto.attendanceConfirmStatus;

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
    const attendances = await this.attendanceRepository.find({
      where: { assignment: { assignmentId: assignmentId } },
      relations: ['assignment', 'user'],
    });
    if (!attendances) {
      throw new NotFoundException('attendances not found');
    } else {
      return attendances;
    }
  }
}
