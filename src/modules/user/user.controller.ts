import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { CreateUserDto } from "src/dtos/CreateUser.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userservice: UserService){}

    @Get()
    alluser(@Query('page') page:number=1, @Query('limit') limit:number=5){
        if(page || limit){
            return this.userservice.alluser(page, limit)
        }else{
            return this.userservice.alluser(page, limit)
        }
    }

    @Get(':id')
    userByid(@Param('id', ParseUUIDPipe) id:string){
        return this.userservice.userByid(id)
    }
    

    @Put(':id')
    updateuser(@Param('id', ParseUUIDPipe) id:string, @Body() data:Partial<CreateUserDto>){
        return this.userservice.updateuser(id, data)
    }

    @Delete(':id')
    deleteuser(@Param('id', ParseUUIDPipe) id:string){

        return this.userservice.deleteuser(id)
    }


}