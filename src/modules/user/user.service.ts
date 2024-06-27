import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as users from '../../utils/users.data.json';
import { User } from 'src/entity/User.entity';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async userSeeder() {
    try {
      for (const user of users) { 
        const existingUser = await this.userRepository
        .createQueryBuilder('users')
        .where('users.email =:email', {email: user.email})
        .getOne()

        console.log(user.name)
        
        if(!existingUser){
          const newUser = this.userRepository.create({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            phone: user.phone,
            address: user.address,
            user_photo: user.user_photo,
            membership_status: MembershipStatus.ACTIVE
          })

          await this.userRepository.save(newUser)
        }
      }
    } catch (error) {
      console.error('Error during the seeding process:', error);
      throw new Error('Error importing users.data.json');
    }
  }
}
