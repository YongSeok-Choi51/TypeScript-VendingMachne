export class ProductResource {

    productId: number;
    resourceId: number;
    amount: number;

    constructor(productId: number, resourceId: number, amount: number) {
        this.productId = productId;
        this.resourceId = resourceId;
        this.amount = amount;
    }
}