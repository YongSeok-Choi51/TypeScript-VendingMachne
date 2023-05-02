import { PoolConnection } from 'mysql2/promise';
import { DefaultVendingMachineResource } from '../entity/machine/DefaultVendingMachineResource';
import { PionRepository } from './PionRepository';


export class DefaultVendingMachineResourceRepository extends PionRepository<DefaultVendingMachineResource> {


    constructor() {
        super();
    }

    save(entity: DefaultVendingMachineResource): Promise<DefaultVendingMachineResource> {
        throw new Error('Method not implemented.');
    }

    saveAll(): Promise<number> {
        throw new Error('Method not implemented.');
    }

    findById(id: number): Promise<DefaultVendingMachineResource> {
        throw new Error('Method not implemented.');
    }

    async findAll(conn: PoolConnection) {
        const selectDefResourceQuery = `
        SELECT
            def.resource_id as resourceId,
            def.amount
        FROM pixar.vending_machine_resource_default def;
        `;
        const [rows, fields] = await conn.query({ sql: selectDefResourceQuery });
        return rows && (rows as Array<DefaultVendingMachineResource>);

    }

    updateById(id: number, valueList: DefaultVendingMachineResource[]): Promise<DefaultVendingMachineResource[]> {
        throw new Error('Method not implemented.');
    }

    deleteById(id: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

} 