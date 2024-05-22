/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Assignment)
    private assignmentRespository: Repository<Assignment>,
  ) {}
  async create(
    createAttendanceDto: CreateAttendanceDto,
    imageFile: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId: createAttendanceDto.userId },
      });
      const assignment = await this.assignmentRespository.findOne({
        where: { assignmentId: createAttendanceDto.assignmentId },
      });

      if (!user || !assignment) {
        throw new Error('User or Assignment not found');
      }

      const newAttendance = new Attendance();
      newAttendance.attendanceDate = new Date();
      //save image to base 64
      if (imageFile) {
        newAttendance.attendanceImage = imageFile.buffer.toString('base64');
      }
      newAttendance.attendanceConfirmStatus =
        createAttendanceDto.attendanceConfirmStatus;
      //if date in assignment is greater than current  15 minutes create status late but in 15 minutes create status on time
      const currentDate = new Date();
      const assignmentDate = new Date(assignment.assignMentTime);
      const diff = Math.abs(currentDate.getTime() - assignmentDate.getTime());
      const diffMinutes = Math.ceil(diff / (1000 * 60));
      if (diffMinutes > 15) {
        newAttendance.attendanceStatus = 'late';
      } else {
        newAttendance.attendanceStatus = 'on time';
      }
      newAttendance.user = user;
      newAttendance.assignment = assignment;

      return this.attendanceRepository.save(newAttendance);
    } catch (error) {
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
}
