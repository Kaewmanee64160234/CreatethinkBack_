/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}
  create(createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceRepository.save(createAttendanceDto);
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

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.attendanceRepository.findOneBy({ id: id });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    }
    return await this.attendanceRepository.save({
      ...attendance,
      ...updateAttendanceDto,
    });
  }

  async remove(id: number) {
    const attendance = await this.attendanceRepository.findOneBy({ id: id });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    }
    return this.attendanceRepository.softRemove(attendance);
  }
}
