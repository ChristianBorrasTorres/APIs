/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoTiendaServiceController } from './producto-tienda.controller';

@Module({
  providers: [ProductoTiendaService],
  imports: [TypeOrmModule.forFeature([ProductoEntity, TiendaEntity])],
  controllers: [ProductoTiendaServiceController],
})
export class ProductoTiendaModule {}
