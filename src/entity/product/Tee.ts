import { Product } from './Product';


export class Tee extends Product {

    _ice: boolean;

    constructor(cup: number, water: number, ice?: boolean) {
        super(cup, water);
        this._ice = ice ? ice : false;
    }

}