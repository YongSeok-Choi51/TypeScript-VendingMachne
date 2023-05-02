import { ProductEntity } from '../product/Product';
import { VendingMachineResource } from './VendingMachineResource';

export interface DefVMResource {
    resourceId: number;
    amount: number;
}

export class VendingMachine {

    id: number;
    name: string;
    vmResource: Array<VendingMachineResource>;
    menuList: Array<ProductEntity>;

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

    set setMenuList(menuList: Array<ProductEntity>) {
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
