/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}
  create(createTeacherDto: CreateTeacherDto) {
    return this.teacherRepository.save(createTeacherDto);
  }

  findAll() {
    return this.teacherRepository.find();
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOneBy({ id: id });
    if (!teacher) {
      throw new NotFoundException('teacher not found');
    } else {
      return teacher;
    }
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teacherRepository.findOneBy({ id: id });
    if (!teacher) {
      throw new NotFoundException('teacher not found');
    }
    return await this.teacherRepository.save({
      ...teacher,
      ...updateTeacherDto,
    });
  }

  async remove(id: number) {
    const teacher = await this.teacherRepository.findOneBy({ id: id });
    if (!teacher) {
      throw new NotFoundException('teacher not found');
    }
    return this.teacherRepository.softRemove(teacher);
  }
}
