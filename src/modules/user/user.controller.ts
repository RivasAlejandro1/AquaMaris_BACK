import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UsersService){}

    @Get('seeder')
    seeder(){
        this.userService.userSeeder()
    }
}

