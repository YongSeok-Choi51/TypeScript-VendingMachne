import { PoolConnection } from 'mysql2/promise';
import { Product } from '../entity/product/Product';
import { PionRepository } from './PionRepository';


export class ProductRepository extends PionRepository<Product> {

    constructor() {
        super();
    }

    save(entity: Product, conn: PoolConnection): Promise<Product> {
        throw new Error('Method not implemented.');
    }

    saveAll(entityList: Product[], conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }

    async findById(id: number, conn: PoolConnection): Promise<Product> {
        const selectQuery = `
            SELECT
                p.id,
                p.name,
                p.price
            FROM pixar.product p
            WHERE p.id=?
        `;

        const [rows, fields] = await conn.query({ sql: selectQuery }, [id]);
        return rows && (rows as Array<Product>)[0];
    }


    async findAll(conn: PoolConnection) {
        const selectQuery = `
            SELECT
                p.id,
                p.name,
                p.price
            FROM pixar.product p
        `;
        const [rows, fields] = await conn.query({ sql: selectQuery });
        return rows && (rows as Array<Product>).map(e => e);
    }

    updateById(id: number, valueList: Product[], conn: PoolConnection): Promise<Product[]> {
        throw new Error('Method not implemented.');
    }

    deleteById(id: number, conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }
}