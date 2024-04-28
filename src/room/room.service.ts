import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  //create constructor and inject room repository
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}
  create(createRoomDto: CreateRoomDto) {
    //create room from dto
    try {
      //find room number if duplicate
      const room = this.roomRepository.findOne({
        where: { roomNumber: createRoomDto.roomNumber },
      });
      if (room) {
        throw new Error('Room number already exist');
      }
      //create room
      const newRoom = this.roomRepository.create(createRoomDto);
      return this.roomRepository.save(newRoom);
    } catch (e) {
      throw new Error('Cannot create room');
    }
  }

  findAll() {
    return this.roomRepository.find();
  }

  findOne(id: number) {
    //find room by id
    const room = this.roomRepository.findOne({ where: { roomId: id } });
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    //update room by id
    //find room by id
    const room = this.roomRepository.findOne({ where: { roomId: id } });
    if (!room) {
      throw new Error('Room not found');
    }
    //update room
    return this.roomRepository.update(id, updateRoomDto);
  }

  remove(id: number) {
    //delete room by id
    //find room by id
    const room = this.roomRepository.findOne({ where: { roomId: id } });
    if (!room) {
      throw new Error('Room not found');
    }
    //delete room
    return this.roomRepository.delete(id);
  }
}
