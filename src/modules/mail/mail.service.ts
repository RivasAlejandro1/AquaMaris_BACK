import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { transporter } from 'src/config/mailer';
import { MailDto } from 'src/dtos/Mail.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendMail(sendMailData: MailDto) {
    const { to, subject, name } = sendMailData;
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #7fffd4;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              color: #777777;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bienvenido a AquaMaris Hotel\'s, {{name}}!</h1>
            </div>
            <div class="content">
              <p>Estamos encantados de tenerte con nosotros. Esperamos que disfrutes de tu estadía.</p>
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 AquaMaris Hotel\'s. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const template = handlebars.compile(htmlTemplate);
      const htmlToSend = template({ name });

      const info = await transporter.sendMail({
        from: '"AquaMaris Hotels" <aquamarishotelz@gmail.com>',
        to,
        subject,
        html: htmlToSend,
      });

      console.log('Email sent:', info.messageId);
    } catch (err) {
      console.error('Error sending email:', err);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}