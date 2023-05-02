import * as mysql from "mysql2/promise";
import { PoolConnection } from 'mysql2/promise';



export const CONNECTION_POOL: mysql.Pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pixar',
    waitForConnections: true,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0
});

export abstract class PionRepository<Entity> {


    constructor() { }

    async transactionTemplate(func: (id?: number, valueList?: Array<Entity>) => Promise<Entity> | Promise<Array<Entity>> | Promise<number> | undefined) {
        const connection = await CONNECTION_POOL.getConnection();
        try {
            connection.beginTransaction();
            const result = await func();
            connection.commit();
            return result;
        } catch (err) {
            console.log('err: ', err);
            await connection.rollback();
        } finally {
            try {
                connection.release();

            } catch (err) {

            }
        }
    }

    abstract save(entity: Entity, conn: PoolConnection): Promise<Entity>;
    abstract saveAll(entityList: Array<Entity>, conn: PoolConnection): Promise<number>;
    abstract findById(id: number, conn: PoolConnection): Promise<Entity | Entity[]>;
    abstract findAll(conn: PoolConnection): Promise<Array<Entity>>;
    abstract updateById(id: number, valueList: Array<Entity>, conn: PoolConnection): Promise<Array<Entity> | number>;
    abstract deleteById(id: number, conn: PoolConnection): Promise<number>;
}