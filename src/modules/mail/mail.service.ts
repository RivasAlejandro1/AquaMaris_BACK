import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { transporter } from "src/config/mailer";
import { MailDto } from "src/dtos/Mail.dto";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
    async sendMail(sendMailData: MailDto) {
        const { to, subject, name } = sendMailData
        try {
            const html = fs
                .readFileSync(path.join(__dirname, 'templates', 'email-templates.html'), 'utf-8')
                .replace('{{name}}', name)

            const info = await transporter.sendMail({
                from: '"AquaMaris Hotels" <aquamarishotelz@gmail.com>',
                to,
                subject,
                html
            });

            console.log('Email sent:', info.messageId)
        } catch (err) {
            console.error('Error sending email:', err);
            throw new InternalServerErrorException('Error sending email');
        }
    }
}