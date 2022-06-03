import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Note } from './note.model';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private noteModel: typeof Note,
  ) {}

  async create(note, userId: number): Promise<Note> {
    note.user = userId;
    return await this.noteModel.create(note);
  }

  async findAll(userId: number): Promise<Note[]> {
    let items;

    try {
      items = await this.noteModel.findAll({
        where: {
          user: userId,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return items;
  }

  async findOne(id: number, userId: number): Promise<Note> {
    let item;

    try {
      item = await this.noteModel.findOne({
        where: {
          id,
          user: userId,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return item;
  }

  async update(id: number, note: NoteDto, userId: number): Promise<any> {
    let item;

    try {
      item = await this.noteModel.update(note, {
        where: {
          id,
          user: userId,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return item;
  }

  async remove(id: number, userId: number): Promise<void> {
    try {
      const note = await this.noteModel.findOne({
        where: {
          id,
          user: userId,
        },
      });
      await note.destroy();
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
