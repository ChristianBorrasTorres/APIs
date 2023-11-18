/* eslint-disable prettier/prettier */
/* tslint:disable:no-unused-variable */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];

    const tipos = ['Perecedero', 'No perecedero'];
  
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        precio: parseFloat(faker.commerce.price()),
        tipo: tipos[faker.datatype.number({ min: 0, max: tipos.length - 1 })],
      });
      productosList.push(producto);
    }
  };

  it('findAll should return all products', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne should return a product by productoId', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.productoId);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });

  it('create should return a new product', async () => {
    const producto: ProductoEntity = {
      productoId: '',
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'Perecedero',
      tiendas: []
    };
  
    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();
  
    const storedProducto: ProductoEntity = await repository.findOne({ where: { productoId: newProducto.productoId } });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.precio).toEqual(newProducto.precio);
    expect(storedProducto.tipo).toEqual(newProducto.tipo);
  });

  it('create should throw an exception for an invalid product type', async () => {
    const producto: ProductoEntity = {
      productoId: '',
      nombre: faker.commerce.productName(),
      precio: parseFloat(faker.commerce.price()),
      tipo: 'TipoInvalido',
      tiendas: []
    };
    await expect(() => service.create(producto)).rejects.toHaveProperty("message", "Tipo de producto inválido");
  });

  it('update should modify a product', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';
    producto.tipo = 'No perecedero';
  
    const updatedProducto: ProductoEntity = await service.update(producto.productoId, producto);
    expect(updatedProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({ where: { productoId: producto.productoId } });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.tipo).toEqual(producto.tipo);
  });

  it('update should throw an exception for an invalid product', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });

  it('delete should remove a product', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.productoId);
  
    const deletedProducto: ProductoEntity = await repository.findOne({ where: { productoId: producto.productoId } });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });
});