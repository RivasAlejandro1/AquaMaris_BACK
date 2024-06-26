import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entity/Room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
  ) {}
  private AllRooms = [
    {
      id: 'd1b860e0-9696-4d8d-b7a4-6982aa042e3e',
      type: 'Doble',
      price: '150.00',
      description: 'Habitación doble con dos camas sencillas y baño privado.',
      state: 'disponible',
      roomnumber: 201,
      services: [
        {
          id: '090a3586-b28b-4ae1-b12d-0d9d83945f62',
          name: 'AIRE ACONDICIONADO',
          description:
            'Sistema de aire acondicionado en todas las habitaciones.',
        },
        {
          id: '7991863d-5681-4e31-8f76-d54fb205c8a4',
          name: 'WIFI',
          description: 'Conexión inalámbrica a internet de alta velocidad.',
        },
      ],
      images: [],
    },
    {
      id: 'b04a84b6-8470-4c57-82b8-6eb0c2400ec1',
      type: 'Suite',
      price: '300.00',
      description:
        'Suite con sala de estar, dormitorio, baño privado y vista al mar.',
      state: 'disponible',
      roomnumber: 302,
      services: [
        {
          id: '310d9323-76fb-441b-a1c3-1c265dc5a1e3',
          name: 'CALEFACCION',
          description:
            'Sistema de calefacción para mantener las habitaciones cálidas.',
        },
        {
          id: '090a3586-b28b-4ae1-b12d-0d9d83945f62',
          name: 'AIRE ACONDICIONADO',
          description:
            'Sistema de aire acondicionado en todas las habitaciones.',
        },
      ],
      images: [],
    },
    {
      id: '5defc29b-063e-4604-a41c-6224c555dd8b',
      type: 'Estandar',
      price: '100.00',
      description: 'Habitación estándar con cama sencilla y baño privado.',
      state: 'disponible',
      roomnumber: 101,
      services: [
        {
          id: 'f6ed835c-6926-48d2-bac3-24d2af338983',
          name: 'TELEVISION',
          description:
            'Televisión por cable con canales nacionales e internacionales.',
        },
        {
          id: '7991863d-5681-4e31-8f76-d54fb205c8a4',
          name: 'WIFI',
          description: 'Conexión inalámbrica a internet de alta velocidad.',
        },
      ],
      images: [],
    },
    {
      id: 'd2409972-59a0-41ed-8660-c760d60418ff',
      type: 'Estandar',
      price: '120.00',
      description: 'Habitación estándar con cama doble y baño privado.',
      state: 'disponible',
      roomnumber: 102,
      services: [
        {
          id: '909e0f82-4dc3-477e-8aeb-55be00c17819',
          name: 'VISTA AL MAR',
          description: 'Habitaciones con vista panorámica al mar.',
        },
        {
          id: 'f6ed835c-6926-48d2-bac3-24d2af338983',
          name: 'TELEVISION',
          description:
            'Televisión por cable con canales nacionales e internacionales.',
        },
      ],
      images: [],
    },
    {
      id: '424f9584-4778-4272-80f0-02fab62b665d',
      type: 'Doble',
      price: '180.00',
      description: 'Habitación doble con dos camas dobles y baño privado.',
      state: 'disponible',
      roomnumber: 202,
      services: [
        {
          id: '310d9323-76fb-441b-a1c3-1c265dc5a1e3',
          name: 'CALEFACCION',
          description:
            'Sistema de calefacción para mantener las habitaciones cálidas.',
        },
        {
          id: '909e0f82-4dc3-477e-8aeb-55be00c17819',
          name: 'VISTA AL MAR',
          description: 'Habitaciones con vista panorámica al mar.',
        },
      ],
      images: [],
    },
    {
      id: '643603e2-02fe-4ec3-a3c4-e7f6dbafdb3e',
      type: 'Suite',
      price: '250.00',
      description: 'Suite con sala de estar, dormitorio y baño privado.',
      state: 'disponible',
      roomnumber: 301,
      services: [
        {
          id: 'f6ed835c-6926-48d2-bac3-24d2af338983',
          name: 'TELEVISION',
          description:
            'Televisión por cable con canales nacionales e internacionales.',
        },
        {
          id: '7991863d-5681-4e31-8f76-d54fb205c8a4',
          name: 'WIFI',
          description: 'Conexión inalámbrica a internet de alta velocidad.',
        },
      ],
      images: [],
    },
  ];
  async getAllRooms(page, limit) {
    const offset = (page - 1) * limit;
    const allRooms = await this.roomsRepository.find({
      relations: {
        services: true,
        images: true,
      },
      skip: offset,
      take: limit,
    });
    return allRooms;
  }

  async filterRoom(filters) {
    const { types, services } = filters;
    if (types && services) {
      const typesFiltered = this.getByType(types, this.AllRooms);
      return this.getByServices(services, typesFiltered);
    } else if (types && !services) {
      return this.getByType(types, this.AllRooms);
    } else if (!types && services) {
      return this.getByServices(services, this.AllRooms);
    }
    return this.AllRooms;
  }

  getByServices(services, rooms) {
    return rooms.filter((room) =>
      services.every((serviceName) =>
        room.services.some((service) => service.name === serviceName),
      ),
    );
  }

  getByType(types, rooms) {
    return rooms.filter((room) => types.includes(room.type));
  }
}
