import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { UsersService } from './user.service';
import { RolesAdmin } from 'src/help/roles.decoretion';
import { Guard_admin } from 'src/guardiane/admin_guard';
import { Role } from 'src/enum/Role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('seeder')
  async seeder(success: boolean) {
    return await this.userService.userSeeder();
  }

  @Get()
  /* @RolesAdmin(Roles.ADMIN)
    @UseGuards(Guard_admin) */
  alluser(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
    return this.userService.alluser(page, limit);
  }

  @Get(':id')
  userByid(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.userByid(id);
  }

  @Put('superadmin/:id')
  @RolesAdmin(Role.SUPERADMIN)
  @UseGuards(Guard_admin)
  superadminupdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datauser: CreateUserDto,
  ) {
    return this.userService.adminupdate(datauser, id);
  }

  @Put(':id')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(Guard_admin)
  Updateadmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datauser: CreateUserDto,
  ) {
    return this.userService.updateadmin(datauser);
  }

  @Put(':id')
  updateuser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<CreateUserDto>,
  ) {
    return this.userService.updateuser(id, data);
  }

  @Delete(':id')
  deleteuser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteuser(id);
  }
}
