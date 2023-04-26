import { Product } from './Product';


export class Coffee extends Product {

    _coffeePowder: number;
    _ice: boolean;

    constructor(cup: number, water: number, coffeePowder: number, ice?: boolean) {
        super(cup, water);
        this._coffeePowder = coffeePowder;
        this._ice = ice ? ice : false;
    }
}