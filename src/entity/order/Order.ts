

export enum PAYMENT_TYPE {
    CARD = "card",
    CASH = "cash"
}

export class Order {

    id: number;
    vendingMachineId: number;
    productId: number;
    paymentType: PAYMENT_TYPE;
    amount: number;
    totalPrice: number;
    createdAt: Date;
    createdBy: number;
    modifiedAt: Date | undefined;
    modifiedBy: number | undefined;

    constructor() {

    }
}