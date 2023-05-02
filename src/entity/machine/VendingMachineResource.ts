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