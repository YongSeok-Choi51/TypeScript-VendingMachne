
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { VendingMachine } from '../entity/machine/VendingMachine';
import { PionRepository } from './PionRepository';

export class VendingMachineRepository extends PionRepository<VendingMachine> {

    constructor() {
        super();
    }

    async save(entity: VendingMachine, conn: PoolConnection): Promise<VendingMachine> {
        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000).toString();
        entity.name = `vm${randomFourDigitNumber}`;

        const createVmQuery = `
        INSERT INTO
            pixar.vending_machine(id, name)
        VALUES(${entity.id}, '${entity.name}');
    `;

        const selectVmQuery = `
        SELECT
            vm.id,
            vm.name
        FROM pixar.vending_machine vm
        WHERE vm.name='vm${randomFourDigitNumber}'
        AND vm.id=${entity.id}
    `;
        const [rows, fields] = await conn.query({ sql: createVmQuery });
        if ((rows as ResultSetHeader).affectedRows <= 0) {
            throw new Error("insert is not successfully finished.");
        }

        const [selectedRows, _] = await conn.query({ sql: selectVmQuery });
        return selectedRows && (selectedRows as Array<VendingMachine>)[0];
    }

    async findById(id: number, conn: PoolConnection) {
        const selectVmQuery = `
            SELECT
                vm.id,
                vm.name
            FROM pixar.vending_machine vm
            WHERE vm.id=?
        `;

        const [rows, field] = await conn.query({ sql: selectVmQuery }, [id]);
        return rows && (rows as Array<VendingMachine>)[0];
    }


    saveAll(entityList: Array<VendingMachine>, conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }

    findAll(conn: PoolConnection): Promise<VendingMachine[]> {
        throw new Error('Method not implemented.');
    }

    updateById(id: number, valueList: VendingMachine[], conn: PoolConnection): Promise<VendingMachine[]> {
        throw new Error('Method not implemented.');
    }
    deleteById(id: number, conn: PoolConnection): Promise<number> {
        throw new Error('Method not implemented.');
    }
}