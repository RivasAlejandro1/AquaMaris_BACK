import { Service } from './../../entity/Service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as services from '../../utils/services.data.json';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}

  async serviceSeeder() {
    try {
      for (const service of services) {
        const existingService = await this.serviceRepository
          .createQueryBuilder('service')
          .where('service.name = :name', { name: service.name })
          .getOne();

        if (!existingService) {
          const newService = this.serviceRepository.create({
            name: service.name,
            description: service.description,
          });
          await this.serviceRepository.save(newService);
        }
      }
      return true;
    } catch (error) {
      console.log(
        'Error al importar o procesar el archivo services.data.json:',
        error,
      );
      throw new Error('Error importando services.data.json');
    }
  }
}
