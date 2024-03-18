/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  create(createStudentDto: CreateStudentDto) {
    return this.studentRepository.save(createStudentDto);
  }

  findAll() {
    return this.studentRepository.find();
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOneBy({ id: id });
    if (!student) {
      throw new NotFoundException('student not found');
    } else {
      return student;
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOneBy({ id: id });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    return await this.studentRepository.save({
      ...student,
      ...updateStudentDto,
    });
  }

  async remove(id: number) {
    const student = await this.studentRepository.findOneBy({ id: id });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    return this.studentRepository.softRemove(student);
  }
}
