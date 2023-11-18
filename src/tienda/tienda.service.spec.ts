/* eslint-disable prettier/prettier */
/* tslint:disable:no-unused-variable */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
  
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.city.name.substring(0, 3).toUpperCase(),
        direccion: faker.address.streetAddress(),
      });
      tiendasList.push(tienda);
    }
  };

  it('findAll should return all stores', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
    expect(tienda.ciudad).toEqual(storedTienda.ciudad);
    expect(tienda.direccion).toEqual(storedTienda.direccion);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada");
  });

  it('create should return a new store', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.streetAddress(),
      productos: []
    };
  
    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();
  
    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: newTienda.id } });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre);
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad);
    expect(storedTienda.direccion).toEqual(newTienda.direccion);
  });

  it('create should throw an exception for invalid city code', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: 'CiudadInvalida',
      direccion: faker.address.streetAddress(),
      productos: []
    };
    await expect(() => service.create(tienda)).rejects.toHaveProperty("message", "Código de ciudad inválido");
  });

  it('update should modify a store', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = 'New name';
  
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre);
  });

  it('update should throw an exception for an invalid store', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = 'New name';
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada");
  });

  it('delete should remove a store', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
  
    const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } });
    expect(deletedTienda).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada");
  });
});
