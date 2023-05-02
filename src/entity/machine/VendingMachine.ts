import { Product } from '../product/Product';
import { VendingMachineResource } from './VendingMachineResource';

export class VendingMachine {

    id: number;
    name: string;
    vmResource: Array<VendingMachineResource>;
    menuList: Array<Product>;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    set setVmResource(vmResource: Array<VendingMachineResource>) {
        if (vmResource.length === 0) {
            console.log("invalid resource!");
            return;
        }
        this.vmResource = vmResource;
    }

    set setMenuList(menuList: Array<Product>) {
        if (menuList.length === 0) {
            console.log("invalid menuList");
            return;
        }
        this.menuList = menuList;
    }

    findLowestPrice() {
        return this.menuList.reduce((min, current) => {
            if (current.price < min.price) {
                return current;
            } else {
                return min;
            }
        }).price;
    }

}
