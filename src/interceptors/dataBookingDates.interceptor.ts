import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";



export class dataBookingDatesInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        request.body.check_in_date = new Date(request.body.check_in_date)
        request.body.check_out_date = new Date(request.body.check_out_date)
        
        return next.handle()    
    }
}