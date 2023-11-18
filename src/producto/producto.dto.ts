/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductoDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsNumber()
  readonly precio: number;

  @IsNotEmpty()
  @IsString()
  readonly tipo: string;
}