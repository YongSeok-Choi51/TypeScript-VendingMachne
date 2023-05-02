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

    abstract save(entity: Entity, conn: PoolConnection): Promise<Entity>;
    abstract saveAll(entityList: Array<Entity>, conn: PoolConnection): Promise<number>;
    abstract findById(id: number, conn: PoolConnection): Promise<Entity | Entity[]>;
    abstract findAll(conn: PoolConnection): Promise<Array<Entity>>;
    abstract updateById(id: number, valueList: Array<Entity>, conn: PoolConnection): Promise<Array<Entity> | number>;
    abstract deleteById(id: number, conn: PoolConnection): Promise<number>;
}