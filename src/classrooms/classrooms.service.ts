/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}
  create(createClassroomDto: CreateClassroomDto) {
    return this.classroomRepository.save(createClassroomDto);
  }

  findAll() {
    return this.classroomRepository.find();
  }

  async findOne(id: number) {
    const classroom = await this.classroomRepository.findOneBy({ id: id });
    if (!classroom) {
      throw new NotFoundException('calssroom not found');
    } else {
      return classroom;
    }
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    const classroom = await this.classroomRepository.findOneBy({ id: id });
    if (!classroom) {
      throw new NotFoundException('classroom not found');
    }
    return await this.classroomRepository.save({
      ...classroom,
      ...updateClassroomDto,
    });
  }

  async remove(id: number) {
    const classroom = await this.classroomRepository.findOneBy({ id: id });
    if (!classroom) {
      throw new NotFoundException('classroom not found');
    }
    return this.classroomRepository.softRemove(classroom);
  }
}
