import {
  Controller,
  Request,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/note.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body(new ValidationPipe()) note: NoteDto) {
    const userId = req.user.id;
    return await this.notesService.create(note, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return await this.notesService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOne(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    const item = await this.notesService.findOne(id, userId);
    if (!item) throw new NotFoundException();

    return item;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body(new ValidationPipe()) note: NoteDto,
  ) {
    const userId = req.user.id;
    const item = await this.notesService.update(id, note, userId);
    if (!item) throw new NotFoundException();

    return item;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    return await this.notesService.remove(id, userId);
  }
}
