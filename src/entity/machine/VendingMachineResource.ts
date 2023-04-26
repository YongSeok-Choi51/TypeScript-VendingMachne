export interface VmResourceEntity {
    id: number;
    vendingMachineId: number;
    resourceId: number;
    amount: number;
}

export class VendingMachineResource {
    _resourceId: number;
    _vendingMachineId: number;
    _amount: number;

    constructor(resourceId: number, vendingMachineId: number, amount: number) {
        this._resourceId = resourceId;
        this._vendingMachineId = vendingMachineId;
        this._amount = amount;
    }
}