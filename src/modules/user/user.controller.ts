import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { UsersService } from './user.service';
import { RolesAdmin } from 'src/help/roles.decoretion';
import { Roles } from 'src/enum/Role.enum';
import { Guard_admin } from 'src/guardiane/admin_guard';
import { User } from 'src/entity/User.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('seeder')
  seeder() {
    this.userService.userSeeder();
  }

  @Get()
  /* @RolesAdmin(Roles.ADMIN)
    @UseGuards(Guard_admin) */
  alluser(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
    return this.userservice.alluser(page, limit);
  }

  @Get(':id')
  userByid(@Param('id', ParseUUIDPipe) id: string) {
    return this.userservice.userByid(id);
  }

  @Put('superadmin/:id')
  @RolesAdmin(Roles.SUPERADMIN)
  @UseGuards(Guard_admin)
  superadminupdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datauser: CreateUserDto,
  ) {
    return this.userservice.adminupdate(datauser, id);
  }

  @Put(':id')
  @RolesAdmin(Roles.ADMIN)
  @UseGuards(Guard_admin)
  Updateadmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datauser: CreateUserDto,
  ) {
    return this.userservice.updateadmin(datauser);
  }

  @Put(':id')
  updateuser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<CreateUserDto>,
  ) {
    return this.userservice.updateuser(id, data);
  }

  @Delete(':id')
  deleteuser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userservice.deleteuser(id);
  }
}
