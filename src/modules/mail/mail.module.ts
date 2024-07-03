import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";

@Module({
    imports: [],
    providers:[MailService],
    controllers: [MailController],
    exports: [],
})
export class MailModule{}