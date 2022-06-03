import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UserDto } from './users/dto/user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'notes-consumer',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('events');
    await this.client.connect();
  }

  @Post('register')
  async create(@Body(new ValidationPipe()) user: UserDto) {
    const item = await this.usersService.findByEmail(user.email);
    if (item)
      throw new BadRequestException('User with same email is already exist');

    const newUser = await this.usersService.create(user);

    if (newUser)
      return this.client.send('events', JSON.parse(JSON.stringify(newUser)));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.appService.login(req.user.dataValues);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
