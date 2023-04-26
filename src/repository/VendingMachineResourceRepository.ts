import { DefVMResource } from '../entity/machine/VendingMachine';
import { VmResourceEntity } from '../entity/machine/VendingMachineResource';
import { PionRepository } from './PionRepository';


export class VendingMachineResourceRepository extends PionRepository {

    constructor() {
        super();
    }

    async createTemplate(vmResourceList: Array<Array<number>>) {
        const createVmResourceQuery = `
            INSERT INTO
                pixar.vending_machine_resource (vending_machine_id, resource_id, amount)
            VALUES ?`;
        await this._connection.query({ sql: createVmResourceQuery }, [vmResourceList]);
    }

    async readTemplate(vmId: number) {
        const selectVmResourceQuery = `
            SELECT 
                r.id,
                r.vending_machine_id as vendingMachineId,
                r.resource_id as resourceId,
                r.amount
            FROM pixar.vending_machine_resource r
            WHERE r.vending_machine_id=?
        `;

        const [rows, field] = await this._connection.query({ sql: selectVmResourceQuery }, [vmId]);
        return rows && (rows as Array<VmResourceEntity>).map(e => e);
    }

    async updateTemplate(query: string) {

    }

    async deleteByVmId(vmId: number) {
        const deleteVmResourceQuery = `
            DELETE FROM 
                pixar.vending_machine_resource r 
            WHERE r.vending_machine_id=?`;
        await this._connection.query({ sql: deleteVmResourceQuery }, [vmId]);
    }

    // 지우고 새것으로 insert
    async onFinishTransaction(newResourceList: Array<VmResourceEntity>) {
        await this.deleteByVmId(newResourceList[0].vendingMachineId);
        const inputList = newResourceList.map(e => [e.vendingMachineId, e.resourceId, e.amount]);
        await this.createTemplate(inputList);
    }

    async initDefaultResource(defaultList: Array<DefVMResource>, vmId: number) {
        const inputList = defaultList.map(e => [vmId, e.resourceId, e.amount]);
        await this.createTemplate(inputList);
        return await this.readTemplate(vmId);
    }

    async findByVmId(id: number) {


    }

}