import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User.entity';
import { MembershipStatus } from '../../enum/MembershipStatus.enum';
import { Repository } from 'typeorm';
import * as users from '../../utils/users.data.json';
import * as bcrypt from 'bcrypt'
import { Role } from 'src/enum/Role.enum';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User) private userDBrepository: Repository<User>,
  ) { }

  async userSeeder() {
    try {
      for (const user of users) {
        const existingUser = await this.userDBrepository
          .createQueryBuilder('users')
          .where('users.email =:email', { email: user.email })
          .getOne();

        if (!existingUser) {
          const newUser = this.userDBrepository.create({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            phone: user.phone,
            address: user.address,
            user_photo: user.user_photo,
            membership_status: MembershipStatus.ACTIVE,
          });

          await this.userDBrepository.save(newUser);
        }
      }
      return true;
    } catch (error) {
      console.error('Error during the seeding process:', error);
      throw new Error('Error importing users.data.json');
    }
  }

  async alluser(page: number, limit: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const user = await this.userDBrepository.find({
      relations: ['reservations'],
    });

    if (user.length > 0) {
      const userpage = user.slice(start, end);
      return userpage;
    } else {
      throw new NotFoundException('Not user found');
    }
  }

  async getUserByID(id: string) {
    try {
      const user = await this.userDBrepository.findOne({ where: { id: id } });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      console.log(`Could not get user by id ${id}`, err)
      throw new InternalServerErrorException(`Could not get user by id ${id}`)
    }
  }

  async updateSuperAdmin(datauser: Partial<User>, id: string) {
    try {
      const user = await this.userDBrepository.findOneBy({ id });
      if (!user) throw new NotFoundException(`User with id: ${id} not found`);
      await this.userDBrepository.update(id, datauser);
      return 'Admin updated successfully';
    } catch (err) {
      console.log(`Could not updated Super Admin`, err)
      throw new InternalServerErrorException(`Could not update superAdmin`)
    }
  }

  async updateAdmin(datauser: Partial<User>) {
    try {
      const { role, ...userWithoutRole } = datauser;
      const user = await this.userDBrepository.findOneBy({ id: datauser.id });
      if (!user) throw new NotFoundException(`Admin with id: ${datauser.id} not found `);
      const userupdate = await this.userDBrepository.update(
        user.id,
        userWithoutRole,
      );
      return 'Admin role updated';
    } catch (err) {
      console.log(`Could not update Admin`, err)
      throw new InternalServerErrorException(`Could not update admin`)
    }
  }

  async updateUser(id: string, data: Partial<User>) {
    try {
      const { role, ...datauser } = data;
      const user = await this.userDBrepository.findOneBy({ id: id });
      if (!user) throw new NotFoundException('not user found');
      const userupdate = await this.userDBrepository.update(id, datauser);
      return 'update success';
    } catch (err) {
      console.log(`Could not update user ${id}`, err)
      throw new InternalServerErrorException(`Could not update user ${id}`)
    }
  }

  async deleteUser(id: string) {
    try {
      const date = new Date().toDateString();
      const user = await this.userDBrepository.findOneBy({ id: id });
      if (!user) throw new NotFoundException('not user found');
      user.status = false;
      user.date_end = date;
      const userDelete = await this.userDBrepository.save(user);
      return {
        message: 'User disabled succesfully',
        user: userDelete
      };
    } catch (err) {
      console.log(`Could not disabled user with id ${id}`)
      throw new InternalServerErrorException(`Could not disabled user with ud ${id}`)
    }
  }

  async getUserByRole(role: string) {
    try {
      return await this.userDBrepository.find({ where: { role } })
    } catch (err) {
      console.log(`Could not get users with Role ${role}`)
      throw new InternalServerErrorException(`Could not get users with role ${role}`)
    }
  }

  async updateMembershipStatus(id: string, status: MembershipStatus) {
    try {
      const user = await this.userDBrepository.findOneBy({ id })
      if (!user) throw new NotFoundException(`User with id ${id} not found`)
      user.membership_status = status
      await this.userDBrepository.save(user)
      return `Membership status for user ${user.name} updated to ${status}`
    } catch (err) {
      console.error(`Error updating membership status for user with id ${id}:`, err);
      throw new InternalServerErrorException('Error updating membership status')
    }
  }

  async getUsersByMembershipStatus(status: MembershipStatus) {
    try {
      return await this.userDBrepository.find({ where: { membership_status: status } })
    } catch (err) {
      console.log(`Error getting users by membership status`, err)
      throw new InternalServerErrorException('Error getting users by Membership status')
    }
  }

  async permantlyDeleteUser(id: string) {
    try {
      const user = await this.userDBrepository.findOneBy({ id })
      if (!user) throw new NotFoundException(`User with id: ${id} not found`)
      await this.userDBrepository.remove(user)
      return `User with id ${id} was deleted permanently`
    } catch (err) {
      console.log(`Error removing the user with id: ${id}`, err)
      throw new InternalServerErrorException(`Error removing user with id ${id}`)
    }
  }

  async updatePassword(id: string, newPassword: string) {
    try {
      const user = await this.userDBrepository.findOneBy({ id })
      if (!user) throw new BadRequestException(`User with id: ${id} not found`)
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      await this.userDBrepository.save(user)
      return `User password was updated for ${id}`
    } catch (err) {
      console.log(`Error updating password for user with id ${id}`, err)
      throw new InternalServerErrorException(`Error updating password for user with id ${id}`)
    }
  }

  async updateUserPhoto(id: string, photoUrl: string) {
    try {
      const user = await this.userDBrepository.findOneBy({ id })
      if (!user) throw new BadRequestException(`User with id ${id} not found`)
      user.user_photo = photoUrl
      await this.userDBrepository.save(user)
      return `User with id ${id} photo was updated`
    } catch (err) {
      console.log(`Error updating photo for user with id ${id}`, err)
      throw new InternalServerErrorException(`Error updating photo for user with id ${id}`)
    }
  }

  async countUserByRole(role: string) {
    try {
      const count = await this.userDBrepository.count({ where: { role } })
      return { role, count }
    } catch (err) {
      console.log(`Could not count user with the role ${role}`, err)
      throw new InternalServerErrorException(`Could not count user with the role ${role}`)
    }
  }

  async updateUserStatus(id: string, status: boolean) {
    try {
      const user = await this.userDBrepository.findOneBy({ id })
      if (!user) throw new BadRequestException(`User with id ${id} not found`)
      user.status = status
      await this.userDBrepository.save(user)
      return `User status updated to ${status ? 'Active' : 'Inactive'}`
    } catch (err) {
      console.log(`Error updating status for user with id ${id}`)
      throw new InternalServerErrorException(`Error updating status for user with id ${id}`)
    }
  }

  async getUsersByStatus(status: boolean) {
    try {
      return await this.userDBrepository.find({ where: { status: status } })
    } catch (err) {
      console.log(`Could get user by status ${status}`, err)
      throw new InternalServerErrorException(`Error getting user by status ${status}`)
    }
  }

  async findOrCreateUser(userData: any): Promise<User> {
    let user = await this.userDBrepository.findOne({ where: { email: userData.email } });

    if (!user) {
      user = this.userDBrepository.create({
        name: userData.name,
        email: userData.email,
        password: '',
        role: Role.USER,
        user_photo: userData.user_photo,
        membership_status: MembershipStatus.DISABLED,
      });

      user = await this.userDBrepository.save(user);
    }

    return user;
  }
}
