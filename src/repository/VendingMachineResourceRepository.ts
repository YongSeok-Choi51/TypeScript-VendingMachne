import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { VendingMachineResource } from '../entity/machine/VendingMachineResource';
import { PionRepository } from './PionRepository';
import { Product, ProductEntity } from '../entity/product/Product';


export class VendingMachineResourceRepository extends PionRepository<VendingMachineResource> {

    constructor() {
        super();
    }

    save(entity: VendingMachineResource): Promise<VendingMachineResource> {
        throw new Error('Method not implemented.');
    }


    async saveAll(entityArray: Array<VendingMachineResource>, conn: PoolConnection) {
        const createVmResourceQuery = `
            INSERT INTO
                pixar.vending_machine_resource (vending_machine_id, resource_id, amount)
            VALUES ?`;

        const [rows, fields] = await conn.query({ sql: createVmResourceQuery }, [entityArray.map(e => [e.vendingMachineId, e.resourceId, e.amount])]);
        return (rows as ResultSetHeader).affectedRows!;
    }


    async findById(id: number, conn: PoolConnection) {
        const selectVmResourceQuery = `
            SELECT 
                r.id,
                r.vending_machine_id as vendingMachineId,
                r.resource_id as resourceId,
                r.amount
            FROM pixar.vending_machine_resource r
            WHERE r.vending_machine_id=?
        `;

        const [rows, fields] = await conn.query({ sql: selectVmResourceQuery }, [id]);
        return rows && (rows as Array<VendingMachineResource>).map(e => e);
    }

    findAll(): Promise<VendingMachineResource[]> {
        throw new Error('Method not implemented.');
    }


    async updateById(id: number, valueList: VendingMachineResource[], conn: PoolConnection) {

        let rowCount: number = 0;
        for (const vmResource of valueList) {
            const query = `
            UPDATE pixar.vending_machine_resource r
            SET r.amount=?
            WHERE r.vending_machine_id=?
            AND r.resource_id=?
            `;

            const [rows, fields] = await conn.query({ sql: query }, [vmResource.amount, vmResource.vendingMachineId, vmResource.resourceId]);
            const affectedRows = (rows as ResultSetHeader).affectedRows;
            if (affectedRows === 0) {
                throw new Error("vendingMachine resource update err");
            } else {
                rowCount += affectedRows;
            }
        }
        return rowCount;
    }

    async deleteById(id: number, conn: PoolConnection) {
        const deleteVmResourceQuery = `
            DELETE FROM 
                pixar.vending_machine_resource r 
            WHERE r.vending_machine_id=?`;
        const [rows, fields] = await conn.query({ sql: deleteVmResourceQuery }, [id]);
        return (rows as ResultSetHeader).affectedRows!;
    }

    // 특정 자판기가 가지는 자원중에서, 제품을 제작하는데 부족한 자원이 하나라도 있다면, product_id 반환
    async findUnAvailableProductsByVmId(vmId: number, conn: PoolConnection) {
        const query = `
            SELECT
	            DISTINCT pr.product_id as productId
            FROM pixar.vending_machine vm
            INNER JOIN pixar.vending_machine_resource vm_r ON vm.id=vm_r.vending_machine_id
            INNER JOIN pixar.product_resource pr ON pr.resource_id=vm_r.resource_id
            WHERE vm.id=?
            AND pr.amount > vm_r.amount;
        `;

        const [rows, fields] = await conn.query({ sql: query }, [vmId]);
        return rows && rows as Array<{ productId: number; }>;
    }

}