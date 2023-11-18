/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class TiendaDto {
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly ciudad: string;

  @IsNotEmpty()
  @IsString()
  readonly direccion: string;
}