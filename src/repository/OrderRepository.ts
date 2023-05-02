import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { Order } from '../entity/order/Order';
import { PionRepository } from './PionRepository';

export class OrderRepository extends PionRepository<Order>{


    async save(entity: Order, conn: PoolConnection) {

        const query = `
            INSERT INTO pixar.order(vending_machine_id, product_id, payment_type, amount, total_price, created_at, created_by)
            VALUES(?, ?, ?, ?, ?, ?, ?)
        `;

        const selectQuery = `
            SELECT
                o.id,
                o.vending_machine_id as vendingMachineId,
                o.product_id as productId,
                o.payment_type as paymentType,
                o.amount,
                o.total_price as totalPrice,
                o.created_at as createdAt,
                o.created_by as createdBy,
                o.modified_at as modifiedAt,
                o.modified_by as modifiedBy
            FROM pixar.order o
            WHERE o.id=?
        `;

        const [rows, fields] = await conn.query({ sql: query }, [
            entity.vendingMachineId,
            entity.productId,
            entity.paymentType,
            entity.amount,
            entity.totalPrice,
            entity.createdAt,
            entity.createdBy
        ]);

        const affectedRows = (rows as ResultSetHeader).affectedRows;

        if (affectedRows === 0) {
            throw new Error("order insert error");
        }

        const insertId = (rows as ResultSetHeader).insertId;
        const [selectRows, _] = await conn.query({ sql: selectQuery }, [insertId]);
        return selectRows && (selectRows as Array<Order>)[0];
    }

    saveAll(entityList: Order[], conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }

    findById(id: number, conn: PoolConnection): Promise<Order | Order[]> {
        throw new Error('Method not implemented.');
    }

    findAll(conn: PoolConnection): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }

    updateById(id: number, valueList: Order[], conn: PoolConnection): Promise<number | Order[]> {
        throw new Error('Method not implemented.');
    }

    deleteById(id: number, conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }

}