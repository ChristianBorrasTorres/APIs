/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { ProductoController } from './producto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  providers: [ProductoService],
  controllers: [ProductoController]
})
export class ProductoModule {}
