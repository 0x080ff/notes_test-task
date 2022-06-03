import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(user): Promise<User> {
    return await this.userModel.create(user);
  }

  async findAll(): Promise<User[]> {
    let items;

    try {
      items = await this.userModel.findAll();
    } catch {
      throw new InternalServerErrorException();
    }

    return items;
  }

  async findOne(id: number): Promise<User> {
    let item;

    try {
      item = await this.userModel.findOne({
        where: {
          id,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return item;
  }

  async findByEmail(email: string): Promise<User> {
    let item;

    try {
      item = await this.userModel.findOne({
        where: {
          email,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return item;
  }

  async update(id: number, user: UserDto): Promise<any> {
    let item;

    try {
      item = await this.userModel.update(user, {
        where: {
          id,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return item;
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      await user.destroy();
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
