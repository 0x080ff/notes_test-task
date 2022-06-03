import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class NoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsNumber()
  user: number;
}
