import { ProductEntity } from '../entity/product/Product';
import { PionRepository } from './PionRepository';


export class ProductRepository extends PionRepository {
    constructor() {
        super();
    }

    createTemplate(query: string) {
        throw new Error('Method not implemented.');
    }
    async readTemplate() {

        const selectQuery = `
            SELECT
                p.id,
                p.name,
                p.price
            FROM pixar.product p
        `;

        const [rows, fields] = await this._connection.execute(selectQuery);
        return rows && (rows as Array<ProductEntity>).map(e => ({ ...e, isAvailable: true }));
    }
    updateTemplate(query: string) {
        throw new Error('Method not implemented.');
    }
}