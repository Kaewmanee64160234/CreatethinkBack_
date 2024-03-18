/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}
  create(createRoomDto: CreateRoomDto) {
    return this.roomRepository.save(createRoomDto);
  }

  findAll() {
    return this.roomRepository.find();
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOneBy({ id: id });
    if (!room) {
      throw new NotFoundException('room not found');
    } else {
      return room;
    }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOneBy({ id: id });
    if (!room) {
      throw new NotFoundException('room not found');
    }
    return await this.roomRepository.save({
      ...room,
      ...updateRoomDto,
    });
  }

  async remove(id: number) {
    const room = await this.roomRepository.findOneBy({ id: id });
    if (!room) {
      throw new NotFoundException('room not found');
    }
    return this.roomRepository.softRemove(room);
  }
}
