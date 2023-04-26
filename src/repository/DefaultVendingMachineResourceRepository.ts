import { DefVMResource } from '../entity/machine/VendingMachine';
import { PionRepository } from './PionRepository';


export class DefaultVendingMachineResourceRepository extends PionRepository {
    constructor() {
        super();
    }

    async createTemplate(query: string) { };

    async readTemplate() {
        const selectDefResourceQuery = `
        SELECT
            def.resource_id as resourceId,
            def.amount
        FROM pixar.vending_machine_resource_default def;
        `;

        const [rows, field] = await this._connection.execute(selectDefResourceQuery);
        return rows && (rows as Array<DefVMResource>).map(e => e);
    };

    async updateTemplate(query: string) {

    };


} 