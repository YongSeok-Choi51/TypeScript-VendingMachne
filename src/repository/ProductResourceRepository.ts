
import { ProductResourceEntity } from '../entity/product/ProductResource';
import { PionRepository } from './PionRepository';

export class ProductResourceRepository extends PionRepository {
    constructor() {
        super();
    }

    createTemplate(query: string) {
        throw new Error('Method not implemented.');
    }

    async readTemplate(productId: number) {
        const selectProductResourceQuery = `
            SELECT
                r.product_id as productId,
                r.resource_id as resourceId,
                r.amount
            FROM pixar.product_resource r
            WHERE r.product_id=?
        `;
        const [rows, field] = await this._connection.query({ sql: selectProductResourceQuery }, [productId]);
        return rows && (rows as Array<ProductResourceEntity>).map(e => e);
    }

    updateTemplate(query: string) {
        throw new Error('Method not implemented.');
    }
}