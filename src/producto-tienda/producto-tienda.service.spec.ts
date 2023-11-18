/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoTiendaService } from './producto-tienda.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await productoRepository.clear();
    await tiendaRepository.clear();

    const tipos = ['Perecedero', 'No perecedero'];
  
    producto = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: tipos[faker.datatype.number({ min: 0, max: tipos.length - 1 })],
    });
  
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.city.name.substring(0, 3).toUpperCase(),
        direccion: faker.address.streetAddress(),
      });
      tiendasList.push(tienda);
    }
    producto.tiendas = tiendasList;
    await productoRepository.save(producto);
  };
  it('addStoreToProduct should add a store to a product', async () => {
    const tipos = ['Perecedero', 'No perecedero'];
    const newProducto = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: tipos[faker.datatype.number({ min: 0, max: tipos.length - 1 })],
    });
  
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.streetAddress(),
    });
  
    const result: ProductoEntity = await service.addStoreToProduct(newProducto.productoId, newTienda.id);
    
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0].id).toBe(newTienda.id);
  });

  it('addStoreToProduct should throw an exception for a non-existent store', async () => {
    await expect(service.addStoreToProduct(producto.productoId, "0")).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada");
  });

  it('addStoreToProduct should throw an exception for a non-existent product', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    await expect(service.addStoreToProduct("0", newTienda.id)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });

  it('findStoresFromProduct should return stores from a product', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(producto.productoId);
    expect(tiendas.length).toBeGreaterThan(0);
  });

  it('findStoresFromProduct should throw an exception for a non-existent product', async () => {
    await expect(service.findStoresFromProduct("0")).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });

  it('findStoreFromProduct should throw an exception for a non-existent product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(service.findStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });

  it('findStoreFromProduct should return a specific store from a product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const foundTienda: TiendaEntity = await service.findStoreFromProduct(producto.productoId, tienda.id);
    expect(foundTienda).not.toBeNull();
    expect(foundTienda.id).toBe(tienda.id);
  });

  it('updateStoresFromProduct should update stores for a product', async () => {
    const newTiendasList = [/* array of new store ids */];
    const updatedProducto: ProductoEntity = await service.updateStoresFromProduct(producto.productoId, newTiendasList.map(tienda => tienda.id));
    expect(updatedProducto.tiendas.length).toBe(newTiendasList.length);
  });

  it('updateStoresFromProduct should throw an exception for a non-existent product', async () => {
    const newTiendasList = [tiendasList[0].id];
    await expect(service.updateStoresFromProduct("0", newTiendasList)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });

  it('deleteStoreFromProduct should remove a store from a product', async () => {
    const tiendaToRemove: TiendaEntity = tiendasList[0];
    
    await service.deleteStoreFromProduct(producto.productoId, tiendaToRemove.id);
  
    const updatedProducto: ProductoEntity = await productoRepository.findOne({ where: { productoId: producto.productoId }, relations: ["tiendas"] });
    expect(updatedProducto.tiendas.find(tienda => tienda.id === tiendaToRemove.id)).toBeUndefined();
  });

  it('deleteStoreFromProduct should throw an exception for a non-existent product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(service.deleteStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });
});
