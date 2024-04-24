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
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto) {
    const attendances: Attendance = new Attendance();
    attendances.date = createAttendanceDto.date;
    attendances.status = createAttendanceDto.status;
    const user = await this.userRepository.findOneBy({
      id: createAttendanceDto.userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    attendances.user = user;
    return this.attendanceRepository.save(attendances);
  }

  findAll() {
    return this.attendanceRepository.find();
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOneBy({ id: id });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    } else {
      return attendance;
    }
  }
  async remove(id: number) {
    const attendance = await this.attendanceRepository.findOneBy({ id: id });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    }
    return this.attendanceRepository.softRemove(attendance);
  }
}
