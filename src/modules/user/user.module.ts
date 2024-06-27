import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UsersService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/User.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])], 
    providers: [UsersService],
    controllers: [UserController]
})
export class UserModule{}