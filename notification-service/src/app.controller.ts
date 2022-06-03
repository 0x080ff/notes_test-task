import { Controller } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mailerService: MailerService,
  ) {}

  @MessagePattern('events')
  sendEmail(@Payload() message) {
    setTimeout(async () => {
      const { email, name } = message.value;

      await this.mailerService.sendMail({
        to: email,
        subject: `${name}! Welcome to App!`,
        text: 'Welcome to App!',
      });
    }, 1000);

    const { password, ...user } = message.value;
    return user;
  }
}
