import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  //create constructor to inject roomRepository
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    try {
      //find room byroomNumber is duplicate
      const room = await this.roomRepository.findOne({
        where: { roomNumber: createRoomDto.roomNumber },
      });
      if (room) {
        throw new Error('Room already exists');
      }
      //create new room
      const newRoom = await this.roomRepository.save(createRoomDto);
      //save new room
      return newRoom;
    } catch (error) {
      throw new Error('Error creating room');
    }
  }

  findAll() {
    try {
      //find all rooms
      return this.roomRepository.find();
    } catch (error) {
      throw new Error('Error fetching rooms');
    }
  }

  findOne(id: number) {
    try {
      //find room by id
      return this.roomRepository.findOne({ where: { roomId: id } });
    } catch (error) {
      throw new Error('Error fetching room');
    }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    //check if room exists
    const room = await this.roomRepository.findOne({ where: { roomId: id } });
    if (!room) {
      throw new Error('Room not found');
    }
    //update room
    const updatedRoom = await this.roomRepository.update(id, updateRoomDto);
    return updatedRoom;
  }

  async remove(id: number) {
    //check if room exists
    const room = await this.roomRepository.findOne({ where: { roomId: id } });
    if (!room) {
      throw new Error('Room not found');
    }
    //delete room
    return this.roomRepository.delete(id);
  }
  //find room by roomNumber
  async findByRoomNumber(roomNumber: string) {
    return this.roomRepository.findOne({ where: { roomNumber: roomNumber } });
  }
}
