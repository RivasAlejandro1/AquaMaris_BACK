import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { formatISO } from "date-fns";
import { Observable } from "rxjs";



export class dataBookingDatesInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()


        
        const startInfo = request.body.check_in_date;
        const endInfo = request.body.check_out_date;
        const regex =  /^(?:20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))$/

        if(!startInfo || !endInfo) return next.handle()  
        if(regex.test(startInfo) && regex.test(endInfo)){
            const start = request.body.check_in_date.split("-").map(e => Number(e))
            const end = request.body.check_out_date.split("-").map(e => Number(e))

            request.body.check_in_date =  new Date(start[0],start[1]-1, start[2]);
            request.body.check_out_date = new Date(end[0],end[1]-1, end[2]);
        }


        return next.handle();
    }
}