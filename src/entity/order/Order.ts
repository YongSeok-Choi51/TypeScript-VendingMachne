

export enum PAYMENT_TYPE {
    CARD = "card",
    CASH = "cash"
}

export class Order {

    id: number | undefined;
    vendingMachineId: number;
    productId: number;
    paymentType: PAYMENT_TYPE;
    amount: number;
    totalPrice: number;
    createdAt: Date;
    createdBy: number;
    modifiedAt: Date | undefined;
    modifiedBy: number | undefined;

    constructor(
        vendingMachineId: number,
        productId: number,
        paymentType: PAYMENT_TYPE,
        amount: number,
        totalPrice: number,
        createdAt: Date,
        createdBy: number,
        id?: number) {

        this.vendingMachineId = vendingMachineId;
        this.productId = productId;
        this.paymentType = paymentType;
        this.amount = amount;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.id = id;
    }
}