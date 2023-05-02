import { PoolConnection } from 'mysql2/promise';
import { Order } from '../entity/order/Order';
import { PionRepository } from './PionRepository';

export class OrderRepository extends PionRepository<Order>{
    save(entity: Order, conn: PoolConnection): Promise<Order> {
        throw new Error('Method not implemented.');
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