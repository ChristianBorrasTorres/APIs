/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, HttpCode, Param, UseInterceptors } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TiendaDto } from './tienda.dto';
import { TiendaEntity } from './tienda.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Get()
  async findAll() {
    return await this.tiendaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tiendaService.findOne(id);
  }

  @Post()
  async create(@Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.create(tienda);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.update(id, tienda);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.tiendaService.delete(id);
  }
}
