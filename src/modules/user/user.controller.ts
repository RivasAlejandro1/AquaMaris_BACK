import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Put, Query, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "src/dtos/CreateUser.dto";
import { UserService } from "./user.service";
import { RolesAdmin } from "src/help/roles.decoretion";
import { Roles } from "src/enum/Role.enum";
import { Guard_admin } from "src/guardiane/admin_guard";
import { User } from "src/entity/User.entity";

@Controller('user')
export class UserController {
    constructor(private readonly userservice: UserService){}

    @Get()
    @RolesAdmin(Roles.ADMIN)
    @UseGuards(Guard_admin)
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
     
    /// admin
    @Put('superadmin/:id')
    @RolesAdmin(Roles.SUPERADMIN)
    @UseGuards(Guard_admin)
    adminupdate(@Param('id', ParseUUIDPipe) id:string, @Body() datauser: User){
       return this.userservice.adminupdate(datauser, id)
    }

   /*  @Put('admin/:id')     
        UpdateDateColumn(){

    } */
    

    @Put(':id')
    updateuser(@Param('id', ParseUUIDPipe) id:string, @Body() data:Partial<CreateUserDto>){
        return this.userservice.updateuser(id, data)
    }

    @Delete(':id')
    deleteuser(@Param('id', ParseUUIDPipe) id:string){
        return this.userservice.deleteuser(id)
    }


}