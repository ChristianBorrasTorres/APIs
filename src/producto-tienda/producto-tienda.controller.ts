/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, HttpCode, Param, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaDto } from '../tienda/tienda.dto';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaServiceController {
   constructor(private readonly productoTiendaService: ProductoTiendaService){}

   @Post(':productoId/stores/:id')
   async addStoreToProduct(@Param('productoId') productoId: string, @Param('id') id: string){
       return await this.productoTiendaService.addStoreToProduct(productoId, id);
   }

   @Get(':productoId/stores/:id')
   async findStoreFromProduct(@Param('productoId') productoId: string, @Param('id') id: string){
       return await this.productoTiendaService.findStoreFromProduct(productoId, id);
   }

   @Get(':productoId/stores')
   async findStoresFromProduct(@Param('productoId') productoId: string){
       return await this.productoTiendaService.findStoresFromProduct(productoId);
   }

    @Put(':productoId/stores')
    async updateStoresFromProduct(@Body() tiendasDto: TiendaDto[], @Param('productoId') productoId: string) {
        const tiendaIds = tiendasDto.map(tienda => tienda.id);
        return await this.productoTiendaService.updateStoresFromProduct(productoId, tiendaIds);
    }

   @Delete(':productoId/stores/:id')
   @HttpCode(204)
   async deleteStoreFromProduct(@Param('productoId') productoId: string, @Param('id') id: string){
       return await this.productoTiendaService.deleteStoreFromProduct(productoId, id);
   }
}
