import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/User.entity";
import { Repository } from "typeorm";

@Injectable()

export class UserService{
    
    constructor(@InjectRepository(User) private userDBrepository: Repository<User>){}
    
    async alluser(page: number, limit: number) {

        return page + limit
        
      /*   const start = (page - 1) * limit
        const end = start + limit
        const user = await this.userDBrepository.find()
        if(user.length > 0){
            const userpage = user.slice(start, end)
            return userpage
        }else{
            throw new Error("Not user found");
        } */
    }
    
    async userByid(id: string) {
        return "hello"
        throw new Error("Method not implemented.");
    }
    
    async updateuser(id:string, data:Partial<User>) {
        return "update hello"
        throw new Error("Method not implemented.");
    }
    
    async deleteuser(id: string) {
        return "delete user"
        throw new Error("Method not implemented.");
    }
}