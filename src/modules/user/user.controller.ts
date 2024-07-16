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
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from './user.service';
import { RolesAdmin } from '../../help/roles.decoretion';
import { Guard_admin } from '../../guardiane/admin_guard';
import { Role } from '../../enum/Role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guardiane/auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('seeder')
  async seeder(success: boolean) {
    return await this.userService.userSeeder();
  }

  @Get('superAdminSeeder')
  async superAdminSeeder(success: boolean) {
    return await this.userService.superAdminSeeder();
  }

  @Get()
  /* @RolesAdmin(Roles.ADMIN)
    @UseGuards(Guard_admin) */
  alluser(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
    return this.userService.alluser(page, limit);
  }

  @Get(':id')
  userByid(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserByID(id);
  }

  @Put('superadmin/blockUser/:id')
  blockUser(@Param('id') id) {
    return this.userService.blockUser(id);
  }

  @ApiBearerAuth()
  @RolesAdmin(Role.SUPERADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  @Put('superadmin/:id')
  superAdminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datauser: CreateUserDto,
  ) {
    return this.userService.updateSuperAdmin(datauser, id);
  }

  @ApiBearerAuth()
  @Put('admin/:id')
  @RolesAdmin(Role.SUPERADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datauser: CreateUserDto,
  ) {
    return this.userService.updateAdmin(datauser);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<CreateUserDto>,
  ) {
    return this.userService.updateUser(id, data);
  }

  /*   @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  } */

  @ApiBearerAuth()
  @Get('role/:role')
  @UseGuards(AuthGuard, Guard_admin)
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  getUserByRole(@Query() role: string) {
    return this.userService.getUserByRole(role);
  }

  @ApiBearerAuth()
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  @Put('membership/:status')
  permantlyDeleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.permantlyDeleteUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, Guard_admin)
  @RolesAdmin(Role.USER)
  @Put('password/:id')
  updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.userService.updatePassword(id, newPassword);
  }

  @ApiBearerAuth()
  @RolesAdmin(Role.USER)
  @UseGuards(AuthGuard, Guard_admin)
  @Put('photoUrl/:id')
  updateUserPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('photoUrl') photoUrl: string,
  ) {
    return this.userService.updateUserPhoto(id, photoUrl);
  }

  @ApiBearerAuth()
  @RolesAdmin(Role.SUPERADMIN, Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  @Get('count/role/:role')
  countUserByRole(@Param('role') role: string) {
    return this.userService.countUserByRole(role);
  }

  @ApiBearerAuth()
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  @Put('status/:id')
  updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: boolean,
  ) {
    return this.userService.updateUserStatus(id, status);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, Guard_admin)
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  @Get('status/:status')
  getUsersByStatus(@Param('status') status: boolean) {
    return this.userService.getUsersByStatus(status);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, Guard_admin)
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  @Get('registered/months')
  async getUsersRegisteredPerMonths(@Query('months') months: number) {
    return this.userService.userRegisteredPerMonth(months);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, Guard_admin)
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  @Get('booking/percentage')
  getUsersByBookings(@Query('months') months: number) {
    return this.userService.checkUsersBookings(months);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, Guard_admin)
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  @Get('membership/percentage')
  getUsersByMemberShip(@Query('months') months: number) {
    return this.userService.checkMembership(months);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, Guard_admin)
  @RolesAdmin(Role.ADMIN, Role.SUPERADMIN)
  @Get('search/byName')
  getUsersByName(@Query('name') name: string) {
    return this.userService.getUsersByName(name);
  }
}
