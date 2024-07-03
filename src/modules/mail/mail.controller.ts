import { MailDto } from 'src/dtos/Mail.dto';
import { MailService } from './mail.service';
import { Body, Controller, Post } from "@nestjs/common";

@Controller('mail')
export class MailController{
    constructor(private readonly mailService: MailService){}

    @Post('send')
    async sendMail(@Body() mailData: MailDto){
        return this.mailService.sendMail(mailData)
    }
}