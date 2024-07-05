import * as handlebars from 'handlebars'; // Importa Handlebars para la plantilla HTML dinámica
import { transporter } from 'src/config/mailer'; // Importa el transporter de nodemailer
import { MailDto } from 'src/dtos/Mail.dto'; // Importa el DTO de correo
import { Injectable, InternalServerErrorException } from '@nestjs/common'; // Importa Injectable y InternalServerErrorException de NestJS

@Injectable()
export class MailService {
  async sendMail(sendMailData: MailDto) {
    const { to, subject, name, type, message, reservationDate, roomNumber } = sendMailData; // Extrae los datos del DTO

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
              <h1>{{header}}</h1>
            </div>
            <div class="content">
              <p>{{message}}</p>
              {{#if reservationDate}}
                <p>Tu reservación es el {{reservationDate}} en la habitación número {{roomNumber}}.</p>
              {{/if}}
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
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
          header = `Bienvenido a AquaMaris, ${name}!`; 
          defaultMessage = 'Estamos encantados de que hayas tomado esta gran decisión. Esperamos verte en nuestros hoteles pronto.'; 
          break;
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
      throw new InternalServerErrorException('Error sending email'); // Lanza una excepción interna si hay un error
    }
  }
}
