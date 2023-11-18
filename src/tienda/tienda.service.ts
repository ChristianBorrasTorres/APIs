/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) {}

    async findAll(): Promise<TiendaEntity[]> {
        return await this.tiendaRepository.find();
    }

    async findOne(id: string): Promise<TiendaEntity> {
        const tienda = await this.tiendaRepository.findOne({ where: { id } });
        if (!tienda)
            throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        return tienda;
    }

    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        if (tienda.ciudad.length !== 3) {
            throw new BusinessLogicException('Código de ciudad inválido', BusinessError.PRECONDITION_FAILED);
        }
        return await this.tiendaRepository.save(tienda);
    }

    async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
        const persistedTienda = await this.tiendaRepository.findOne({ where: { id } });
        if (!persistedTienda)
            throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        if (tienda.ciudad.length !== 3) {
            throw new BusinessLogicException('Código de ciudad inválido', BusinessError.PRECONDITION_FAILED);
        }

        await this.tiendaRepository.update(id, tienda);
        return this.tiendaRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        const tienda = await this.tiendaRepository.findOne({ where: { id } });
        if (!tienda)
            throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        await this.tiendaRepository.delete(id);
    }
}