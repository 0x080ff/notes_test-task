import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body(new ValidationPipe()) user: UserDto) {
    const item = await this.usersService.findByEmail(user.email);
    if (item)
      throw new BadRequestException('User with same email is already exist');

    return await this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    const item = await this.usersService.findOne(id);
    if (!item) throw new NotFoundException();

    return item;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) user: UserDto,
  ) {
    const item = await this.usersService.update(id, user);
    if (!item) throw new NotFoundException();

    return item;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.usersService.remove(id);
  }
}
