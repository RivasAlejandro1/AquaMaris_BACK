import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async getAllRooms(page, limit) {
    const allRooms = await this.roomsRepository.getAllRooms(page, limit);
    return allRooms;
  }

  async createRoom(infoRoom){
    return await this.roomsRepository.createRoom(infoRoom)
  }

  async seederAllAboutRoom(){
    return await this.roomsRepository.seederAllAboutRoom()
  }
}
