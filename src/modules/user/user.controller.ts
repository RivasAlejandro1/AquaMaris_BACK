import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from './user.service';
import { RolesAdmin } from '../../help/roles.decoretion';
import { Guard_admin } from '../../guardiane/admin_guard';
import { Role } from '../../enum/Role.enum';
import { RegisterDateDto } from 'src/dtos/RegisterRange.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) { }

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
    return this.userService.getUserByID(id);
  }

  @Put('superadmin/:id')
  @RolesAdmin(Role.SUPERADMIN)
  @UseGuards(Guard_admin)
  superAdminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datauser: CreateUserDto,
  ) {
    return this.userService.updateSuperAdmin(datauser, id);
  }

  @Put('admin/:id')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(Guard_admin)
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

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }

  @Get("role/:role")
  @RolesAdmin(Role.ADMIN)
  @UseGuards(Guard_admin)
  getUserByRole(@Query() role: string) {
    return this.userService.getUserByRole(role)
  }

  @Put('membership/:status')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(Guard_admin)
  permantlyDeleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.permantlyDeleteUser(id)
  }

  @Put('password/:id')
  @RolesAdmin(Role.USER)
  @UseGuards(Guard_admin)
  updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.userService.updatePassword(id, newPassword)
  }

  @Post('registeredPerMonths')
  async getUsersRegisteredPerMonths(@Body() monthsData: RegisterDateDto){
    return this.userService.userRegisteredPerMonth(monthsData)
  }

  @Put('photoUrl/:id')
  @RolesAdmin(Role.USER)
  @UseGuards(Guard_admin)
  updateUserPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('photoUrl') photoUrl: string
  ) {
    return this.userService.updateUserPhoto(id, photoUrl)
  }

  @Get('count/role/:role')
  @RolesAdmin(Role.SUPERADMIN)
  @UseGuards(Guard_admin)
  countUserByRole(@Param('role') role: string) {
    return this.userService.countUserByRole(role)
  }

  @Put('status/:id')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(Guard_admin)
  updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: boolean
  ) {
    return this.userService.updateUserStatus(id, status)
  }

  @Get('status/:status')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(Guard_admin)
  getUsersByStatus(
    @Param('status') status: boolean
  ){
    return this.userService.getUsersByStatus(status)
  }

  @Get('membership/percentage')
  getUsersByMemberShip(){
    return this.userService.checkMembership()
  }

  @Get('booking/percentage')
  getUsersByBookings(){
    return this.userService.checkUsersBookings()
  }
}
