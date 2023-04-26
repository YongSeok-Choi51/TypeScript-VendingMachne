
import { VendingMachine, VendingMachineEntity } from '../entity/machine/VendingMachine';
import { PionRepository } from './PionRepository';

export class VendingMachineRepository extends PionRepository {

    constructor() {
        super();
    }

    async createTemplate() {
        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000).toString();

        const createVmQuery = `
            INSERT INTO
                pixar.vending_machine(name)
            VALUES('vm${randomFourDigitNumber}');
        `;

        const selectVmQuery = `
            SELECT
                vm.id,
                vm.name
            FROM pixar.vending_machine vm
            WHERE vm.name='vm${randomFourDigitNumber}'
        `;
        const result = await this._connection.execute(createVmQuery);
        const [rows, field] = await this._connection.execute({ sql: selectVmQuery }, [randomFourDigitNumber]);
        const vmList = rows && (rows as Array<VendingMachineEntity>).map(e => ({ id: e.id, name: e.name }));

        return new VendingMachine(vmList[0].id, vmList[0].name!);
    };


    async findById(id: number) {
        const selectVmQuery = `
            SELECT
                vm.id,
                vm.name
            FROM pixar.vending_machine vm
            WHERE vm.id=?
        `;

        const [rows, field] = await this._connection.query({ sql: selectVmQuery }, [id]);
        return rows && (rows as Array<VendingMachineEntity>).map(e => ({ id: e.id, name: e.name }));
    }



    async readTemplate() {
        const selectQuery = `
            SELECT
                v.id, 
                v.name
            FROM pixar.vending_machine v
            ORDER BY v.id DESC
            LIMIT 1
        `;
        const [rows, field] = await this._connection.query({ sql: selectQuery });
        const vm = rows && (rows as Array<VendingMachineEntity>)[0];
        return vm ? new VendingMachine(vm.id, vm.name) : undefined;
    };

    async updateTemplate(query: string) {

    };

}