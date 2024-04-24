/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createEnrollmentDto: CreateEnrollmentDto) {
    // const enrollment = new Enrollment();
    // // create enrollment
    // const user = await this.userRepository.findOneBy({
    //   id: createEnrollmentDto.userId,
    // });
    // if (!user) {
    //   throw new NotFoundException('user not found');
    // }
    // enrollment.user = user;
    return this.enrollmentRepository.save(createEnrollmentDto);
  }

  findAll() {
    return this.enrollmentRepository.find({
      relations: ['user', 'course'],
    });
  }

  async findOne(id: number) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: id },
      relations: ['user', 'course'],
    });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    } else {
      return enrollment;
    }
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.enrollmentRepository.findOneBy({ id: id });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    }
    return await this.enrollmentRepository.save({
      ...enrollment,
      ...updateEnrollmentDto,
    });
  }

  async remove(id: number) {
    const enrollment = await this.enrollmentRepository.findOneBy({ id: id });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    }
    return this.enrollmentRepository.softRemove(enrollment);
  }
}
