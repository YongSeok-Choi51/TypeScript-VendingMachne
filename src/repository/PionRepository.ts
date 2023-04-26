import * as mysql from "mysql2/promise";



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

    // _connection: mysql.Connection;

    constructor() {
        // this.initConnection();
    }

    // async initConnection() {
    //     this._connection = await mysql.createConnection({
    //         host: "localhost",
    //         user: 'root',
    //         password: '',
    //         database: 'pixar'
    //     });
    // };


    //함수를 전달받아서 

    // findById
    // findAll
    // updateById
    // deleteById
    // save()


    // 모든애들이 기본적으로 가지는, 애들을 명확하게 구현 
    // 내가 만든 템플릿 내부의 동작은 이런 기본적인것들로 구성돼서 커스텀하게 동작하는 것들을 만들어야 한다. (서비스 레이어에서)
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

    abstract save(entity: Entity): Promise<Entity>;
    abstract saveAll(): Promise<number>;
    abstract findById(id: number): Promise<Entity>;
    abstract findAll(): Promise<Array<Entity>>;
    abstract updateById(id: number, valueList: Array<Entity>): Promise<Array<Entity>>;
    abstract deleteById(id: number): Promise<number>;


    abstract createTemplate();
    abstract readTemplate();
    abstract updateTemplate();

}