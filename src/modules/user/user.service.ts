import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/User.entity';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userDBrepository: Repository<User>,
  ) {}

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

  async userByid(id: string) {
    const userid = await this.userDBrepository.findOne({ where: { id: id } });
    if (!userid) throw new NotFoundException('Not user found');
    const { password, ...userwhitout } = userid;
    return userwhitout;
  }

  async adminupdate(datauser: Partial<User>, id: string) {
    const user = this.userDBrepository.findOneBy({ id: datauser.id });
    if (!user) throw new NotFoundException('not user found');
    const userupdate = await this.userDBrepository.update(id, datauser);
    return 'update success';
  }

  async updateadmin(datauser: Partial<User>) {
    const { role, ...datawhituser } = datauser;
    const user = await this.userDBrepository.findOneBy({ id: datauser.id });
    if (!user) throw new NotFoundException('not user found');
    const userupdate = await this.userDBrepository.update(
      user.id,
      datawhituser,
    );
    return 'update success';
  }

  async updateuser(id: string, data: Partial<User>) {
    const { role, ...datauser } = data;
    const user = await this.userDBrepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('not user found');
    const userupdate = await this.userDBrepository.update(id, datauser);
    return 'update success';
  }

  async deleteuser(id: string) {
    const date = new Date().toDateString();
    const user = await this.userDBrepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('not user found');
    user.status = false;
    user.date_end = date;
    const userdelete = await this.userDBrepository.update(id, user);
    return 'change whit successfull';
  }
}
