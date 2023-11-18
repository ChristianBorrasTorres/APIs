/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ) {}

    async findAll(): Promise<ProductoEntity[]> {
        return await this.productoRepository.find();
    }

    async findOne(productoId: string): Promise<ProductoEntity> {
        const producto = await this.productoRepository.findOne({ where: { productoId } });
        if (!producto)
            throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        return producto;
    }

    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        if (producto.tipo !== 'Perecedero' && producto.tipo !== 'No perecedero') {
            throw new BusinessLogicException('Tipo de producto inválido', BusinessError.PRECONDITION_FAILED);
        }
        return await this.productoRepository.save(producto);
    }

    async update(productoId: string, producto: ProductoEntity): Promise<ProductoEntity> {
        const persistedProducto = await this.productoRepository.findOne({ where: { productoId } });
        if (!persistedProducto)
            throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        if (producto.tipo !== 'Perecedero' && producto.tipo !== 'No perecedero') {
            throw new BusinessLogicException('Tipo de producto inválido', BusinessError.PRECONDITION_FAILED);
        }

        await this.productoRepository.update(productoId, producto);
        return this.productoRepository.findOne({ where: { productoId } });
    }

    async delete(productoId: string): Promise<void> {
        const producto = await this.productoRepository.findOne({ where: { productoId } });
        if (!producto)
            throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        await this.productoRepository.delete(productoId);
    }
}