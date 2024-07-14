import { MailDto } from 'src/dtos/Mail.dto';
import { MailService } from './mail.service';
import { Body, Controller, Get, Post } from "@nestjs/common";
import { RegisterUserDto } from 'src/dtos/RegisterCode.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mailing')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send')
    sendMail(@Body() mailData: MailDto) {
        return this.mailService.sendMail(mailData)
    }

    @Post('register/code')
    checkRegisterCode(@Body() registerUserData: RegisterUserDto) {
        return this.mailService.checkRegisterCode(registerUserData)
    }
}