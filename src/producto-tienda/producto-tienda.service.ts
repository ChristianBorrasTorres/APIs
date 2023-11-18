/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>
  ) {}

  async addStoreToProduct(productId: string, tiendaId: string): Promise<ProductoEntity> {
    const tienda = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
    if (!tienda)
      throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
  
    const producto = await this.productoRepository.findOne({ where: { productoId: productId }, relations: ["tiendas"] });
    if (!producto)
      throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
  
    producto.tiendas = [...producto.tiendas, tienda];
    return await this.productoRepository.save(producto);
  }

  async findStoresFromProduct(productId: string): Promise<TiendaEntity[]> {
    const producto = await this.productoRepository.findOne({ where: { productoId: productId }, relations: ["tiendas"] });
    if (!producto)
      throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
  
    return producto.tiendas;
  }

  async findStoreFromProduct(productId: string, tiendaId: string): Promise<TiendaEntity> {
    const producto = await this.productoRepository.findOne({ where: { productoId: productId }, relations: ["tiendas"] });
    if (!producto)
      throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
  
    const tienda = producto.tiendas.find(tienda => tienda.id === tiendaId);
    if (!tienda)
      throw new BusinessLogicException("La tienda con el ID dado no está asociada al producto", BusinessError.PRECONDITION_FAILED);
  
    return tienda;
  }

  async updateStoresFromProduct(productId: string, tiendaIds: string[]): Promise<ProductoEntity> {
    const producto = await this.productoRepository.findOne({ where: { productoId: productId }, relations: ["tiendas"] });
    if (!producto) {
      throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    }

    const tiendas: TiendaEntity[] = [];

    for (const tiendaId of tiendaIds) {
      const tienda = await this.tiendaRepository.findOne({ where: { id: tiendaId } });
      if (!tienda) {
        throw new BusinessLogicException("Una tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      }
      tiendas.push(tienda);
    }

    producto.tiendas = tiendas;

    return await this.productoRepository.save(producto);
  }

  async deleteStoreFromProduct(productId: string, tiendaId: string): Promise<ProductoEntity> {
    const producto = await this.productoRepository.findOne({ where: { productoId: productId }, relations: ["tiendas"] });
    if (!producto)
      throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
  
    producto.tiendas = producto.tiendas.filter(tienda => tienda.id !== tiendaId);
    return await this.productoRepository.save(producto);
  }
}
