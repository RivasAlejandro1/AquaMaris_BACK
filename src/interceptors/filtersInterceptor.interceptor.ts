import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class filtersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { services, types } = request.query;

    const filters = {
      services: services ? services.split(',') : undefined,
      types: types ? types.split(',') : undefined,
    };

    //request.filters = restParams;
    request.query = filters;

    return next.handle();
  }
}
