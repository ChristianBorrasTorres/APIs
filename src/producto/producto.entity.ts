/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { TiendaEntity } from "../tienda/tienda.entity";

@Entity()
export class ProductoEntity {
    @PrimaryGeneratedColumn("uuid")
    productoId: string;

    @Column()
    nombre: string;

    @Column("decimal", { precision: 10, scale: 2 })
    precio: number;

    @Column()
    tipo: string;

    @ManyToMany(() => TiendaEntity, tienda => tienda.productos)
    @JoinTable()
    tiendas: TiendaEntity[];
}