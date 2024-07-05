import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class filterResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.allRooms && Array.isArray(data.allRooms)) {
          return {
            ...data,
            allRooms: data.allRooms.map(this.transformRoom),
          };
        } else {
          return this.transformRoom(data);
        }
      }),
    );
  }

  private transformRoom(room) {
    return {
      ...room,
      services: room.services.map((service) => service.name),
      images: room.images.map((image) => image.url),
    };
  }
}

/* @Injectable()
export class filterResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map(this.transformRoom);
        } else {
          return this.transformRoom(data);
        }
      }),
    );
  }

  private transformRoom(room) {
    return {
      ...room,
      services: room.services.map((service) => service.name),
      images: room.images.map((image) => image.url),
    };
  }
} */
