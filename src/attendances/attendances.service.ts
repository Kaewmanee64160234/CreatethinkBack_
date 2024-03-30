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
  async create(createAttendanceDto: CreateAttendanceDto) {
    const attendances: Attendance = new Attendance();
    attendances.date = createAttendanceDto.date;
    attendances.status = createAttendanceDto.status;

    await this.attendanceRepository.save(attendances);
    for (let i = 0; i < createAttendanceDto.user.length; i++) {
      const user = await this.userRepository.findOne({
        where: { id: createAttendanceDto.user[i].id },
      });
      if (user) {
        const user = new User();
        user.firstName = createAttendanceDto.user[i].firstName;
        user.lastName = createAttendanceDto.user[i].lastName;
        user.email = createAttendanceDto.user[i].email;
        user.role = createAttendanceDto.user[i].role;
        user.studentId = createAttendanceDto.user[i].studentId;
        user.teacherId = createAttendanceDto.user[i].teacherId;
        user.faceDescription1 = createAttendanceDto.user[i].faceDescription1;
        user.faceDescription2 = createAttendanceDto.user[i].faceDescription2;
        user.faceDescription3 = createAttendanceDto.user[i].faceDescription3;
        user.faceDescription4 = createAttendanceDto.user[i].faceDescription4;
        user.faceDescription5 = createAttendanceDto.user[i].faceDescription5;
        await this.attendanceRepository.save(user);
      }
      const assignment = await this.assignmentRespository.findOne({
        where: { id: createAttendanceDto.assignment[i].id },
      });
      if (assignment) {
        const assignment = new Assignment();
        assignment.name = createAttendanceDto.assignment[i].name;
        assignment.date = createAttendanceDto.assignment[i].date;
        await this.attendanceRepository.save(assignment);
      }
    }
    await this.attendanceRepository.save(attendances);
    return await this.attendanceRepository.findOne({
      where: { id: attendances.id },
      relations: ['user', 'assignment'],
    });
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

  // async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
  //   const attendance = await this.attendanceRepository.findOneBy({ id: id });
  //   if (!attendance) {
  //     throw new NotFoundException('attendance not found');
  //   }

  // }

  async remove(id: number) {
    const attendance = await this.attendanceRepository.findOneBy({ id: id });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    }
    return this.attendanceRepository.softRemove(attendance);
  }
}
