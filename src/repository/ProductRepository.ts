import { PoolConnection } from 'mysql2/promise';
import { ProductEntity } from '../entity/product/Product';
import { PionRepository } from './PionRepository';


export class ProductRepository extends PionRepository<ProductEntity> {

    constructor() {
        super();
    }

    save(entity: ProductEntity, conn: PoolConnection): Promise<ProductEntity> {
        throw new Error('Method not implemented.');
    }

    saveAll(entityList: ProductEntity[], conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }

    async findById(id: number, conn: PoolConnection): Promise<ProductEntity> {
        const selectQuery = `
            SELECT
                p.id,
                p.name,
                p.price
            FROM pixar.product p
            WHERE p.id=?
        `;

        const [rows, fields] = await conn.query({ sql: selectQuery }, [id]);
        return rows && (rows as Array<ProductEntity>)[0];
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
        return rows && (rows as Array<ProductEntity>).map(e => e);
    }

    updateById(id: number, valueList: ProductEntity[], conn: PoolConnection): Promise<ProductEntity[]> {
        throw new Error('Method not implemented.');
    }

    deleteById(id: number, conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }
}