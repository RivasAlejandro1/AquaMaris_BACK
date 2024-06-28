import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class filtersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { arrive_date, departure_date, services, types, page, people } =
      request.query;
    if (!arrive_date)
      throw new BadRequestException('Debes ingresar una fecha de ingreso');
    const filters = {
      arrive: arrive_date,
      departure_date: departure_date ? departure_date : undefined,
      services: services ? services.split(',') : undefined,
      types: types ? types.split(',') : undefined,
      page: page ? Number(page) : undefined,
      people: people ? people : undefined,
    };
    request.query = filters;

    return next.handle();
  }
}
