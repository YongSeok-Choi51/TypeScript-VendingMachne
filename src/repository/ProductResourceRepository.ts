
import { PoolConnection } from 'mysql2/promise';
import { ProductResource } from '../entity/product/ProductResource';
import { PionRepository } from './PionRepository';

export class ProductResourceRepository extends PionRepository<ProductResource> {

    constructor() {
        super();
    }

    save(entity: ProductResource, conn: PoolConnection): Promise<ProductResource> {
        throw new Error('Method not implemented.');
    }
    saveAll(entityList: ProductResource[], conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }

    async findById(id: number, conn: PoolConnection): Promise<ProductResource | ProductResource[]> {
        const selectProductResourceQuery = `
        SELECT
            r.product_id as productId,
            r.resource_id as resourceId,
            r.amount
        FROM pixar.product_resource r
        WHERE r.product_id=?
    `;
        const [rows, field] = await conn.query({ sql: selectProductResourceQuery }, [id]);
        return rows && (rows as Array<ProductResource>).map(e => e);
    }

    findAll(conn: PoolConnection): Promise<ProductResource[]> {
        throw new Error('Method not implemented.');

    }

    updateById(id: number, valueList: ProductResource[], conn: PoolConnection): Promise<ProductResource[]> {
        throw new Error('Method not implemented.');
    }
    deleteById(id: number, conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }
}