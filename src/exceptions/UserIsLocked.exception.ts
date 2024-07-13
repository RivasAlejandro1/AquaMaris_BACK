import { HttpException, HttpStatus } from "@nestjs/common";



export class UserIsLockedException extends HttpException {
    constructor(){
        super("User is locked", HttpStatus.FORBIDDEN);
    }
}