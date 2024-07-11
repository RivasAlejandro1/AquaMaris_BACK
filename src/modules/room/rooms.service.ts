import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async getAllRooms(page, limit) {
    const allRooms = await this.roomsRepository.getAllRooms(page, limit);
    return allRooms;
  }

  async roomSeeder() {
    return await this.roomsRepository.roomSeeder();
  }
  async filterRoom(filters) {
    const rooms = await this.roomsRepository.filterRoom(filters);
    return rooms;
  }
  async createRoom(infoRoom) {
    return await this.roomsRepository.createRoom(infoRoom);
  }
  async getById(id) {
    return await this.roomsRepository.getById(id);
  }

  async getByNum(num: number) {
    return await this.roomsRepository.getByNum(num);
  }
}
