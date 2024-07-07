import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegisterCode } from "src/entity/RegisterCodes";
import { User } from "src/entity/User.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, RegisterCode])],
    providers:[MailService],
    controllers: [MailController],
    exports: [],
})
export class MailModule{}