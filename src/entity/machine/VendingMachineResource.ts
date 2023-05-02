export interface VmResourceEntity {
    id: number;
    vendingMachineId: number;
    resourceId: number;
    amount: number;
}

export class VendingMachineResource {
    resourceId: number;
    vendingMachineId: number;
    amount: number;

    constructor(resourceId: number, vendingMachineId: number, amount: number) {
        this.resourceId = resourceId;
        this.vendingMachineId = vendingMachineId;
        this.amount = amount;
    }
}