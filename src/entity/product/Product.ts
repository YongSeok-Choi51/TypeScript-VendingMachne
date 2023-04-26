export interface ProductEntity {
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
}


export abstract class Product {

    _cup: number;
    _water: number;

    constructor(cup: number, water: number) {
        this._cup = cup;
        this._water = water;
    }

}