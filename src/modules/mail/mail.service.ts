import * as handlebars from 'handlebars'; // Importa Handlebars para la plantilla HTML dinámica
import { transporter } from 'src/config/mailer'; // Importa el transporter de nodemailer
import { MailDto } from 'src/dtos/Mail.dto'; // Importa el DTO de correo
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { getRegisterCode } from 'src/helpers/getRegisterCode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/User.entity';
import { RegisterCode } from 'src/entity/RegisterCodes';
import { RegisterUserDto } from 'src/dtos/RegisterCode.dto';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RegisterCode) private registerCodeRepository: Repository<RegisterCode>
  ) { }

  async sendMail(sendMailData: MailDto) {
    const { to, subject, name, type, message, reservationDate, roomNumber, email } = sendMailData;

    try {
      let htmlTemplate = `
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
              background-color: #51A1A8; 
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              color: #000000;
            }
            .header img {
              max-width: 200px;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
              color: #000000; 
              text-align: center;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              color: #777777;
              font-size: 12px;
            }
            .button {
              display: inline-block;
              background-color: #17858A;
              color: #ffffff; 
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              border: none;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
            .button a {
              color: #ffffff; 
              text-decoration: none;
            }
            .button:hover {
              background-color: #035155;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="URL" alt="Logo de la empresa">
              <h1>{{header}}</h1>
            </div>
            <div class="content">
              <p>{{message}}</p>
              {{#if reservationDate}}
                <p>Tu reservación es el {{reservationDate}} en la habitación número {{roomNumber}}.</p>
              {{/if}}
              <p style="color: #000000;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
              <button class="button">
                <a href="h" style="color: #ffffff;">Confirmar codigo</a>
              </button>
            </div>
            <div class="footer">
              <p>&copy; 2024 AquaMaris Hotel's. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      let header, defaultMessage;

      switch (type) {
        case 'register':
          try {
            const registerCode = getRegisterCode()
            const user = await this.userRepository.findOne({ where: { email: email } })

            if (!user) throw new NotFoundException(`User with id ${user} not found`)


            await this.registerCodeRepository.save({
              code: registerCode,
              user: user
            })

            header = `Bienvenido a AquaMaris, ${name}!`;
            defaultMessage = `Estamos encantados de que hayas tomado esta gran decisión. Para completar tu proceso de registro necesitamos que te ingreses el codigo de suscripcion en nuestra plataforma ${registerCode}, Esperamos verte en nuestros hoteles pronto.`;
            break;
          } catch (err) {
            console.log(`Error sending email to user with email ${email}`, err)
            throw new InternalServerErrorException(`Error sending email to user with id ${email}`)
          }
        case 'reservation':
          header = `Bienvenido a AquaMaris Hotel's, ${name}!`;
          defaultMessage = 'Estamos encantados de tenerte con nosotros. Esperamos que disfrutes de tu estadía.';
          break;
        case 'cancellation':
          header = `Reservación Cancelada, ${name}`;
          defaultMessage = 'Lamentamos informarte que tu reservación ha sido cancelada. Si tienes alguna pregunta, no dudes en contactarnos.';
          break;
        case 'membership_subscription':
          header = `¡Gracias por unirte a nuestra membresía, ${name}!`;
          defaultMessage = 'Estamos encantados de tenerte como miembro. Esperamos que disfrutes de los beneficios de tu membresía.';
          break;
        case 'membership_cancellation':
          header = `Membresía Cancelada, ${name}`;
          defaultMessage = 'Lamentamos informarte que tu membresía ha sido cancelada. Si tienes alguna pregunta, no dudes en contactarnos.';
          break;
        default:
          throw new Error('Tipo de correo no soportado');
      }

      const template = handlebars.compile(htmlTemplate);
      const htmlToSend = template({ header, message: message || defaultMessage, reservationDate, roomNumber });

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

  async checkRegisterCode(registerUserData: RegisterUserDto) {
    const { email, code } = registerUserData

    const codeToNumber = Number(code)
    const user = await this.userRepository.findOne({ where: { email: email } })

    console.log(codeToNumber)

    if (!user) throw new NotFoundException(`Could get user with email ${email} `)

    const codeUser = await this.registerCodeRepository.findOne({ where: { user: user } })
    if (!codeUser) throw new NotFoundException(`Could get a code for the user with email ${email}`)

    const codeCode = await this.registerCodeRepository.findOne({ where: { code: codeToNumber } })
    if(!codeCode) throw new NotFoundException(`The code ${code} does not exist for user with email ${email}`)

    codeUser.checked = true

    await this.registerCodeRepository.save(codeUser)

    return {message: `The code was succesfully verified`}
  }
}
