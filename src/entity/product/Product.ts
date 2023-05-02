export interface ProductEntity {
    id: number;
    name: string;
    price: number;
}


export abstract class Product {

    cup: number;
    water: number;

    constructor(cup: number, water: number) {
        this.cup = cup;
        this.water = water;
    }

}