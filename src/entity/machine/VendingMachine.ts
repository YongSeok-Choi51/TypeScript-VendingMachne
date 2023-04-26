import { ProductEntity } from '../product/Product';
import { VmResourceEntity } from './VendingMachineResource';

export interface VendingMachineEntity {
    id: number;
    name: string;
    vmResource?: Array<VmResourceEntity>;
    menu?: Array<ProductEntity>;
}

export interface DefVMResource {
    resourceId: number;
    amount: number;
}

export class VendingMachine {

    _id: number;
    _name: string;
    _vmResource: Array<VmResourceEntity>;
    _menuList: Array<ProductEntity>;

    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    set setVmResource(vmResource: Array<VmResourceEntity>) {
        if (vmResource.length === 0) {
            console.log("invalid resource!");
            return;
        }
        this._vmResource = vmResource;
    }

    set setMenuList(menuList: Array<ProductEntity>) {
        if (menuList.length === 0) {
            console.log("invalid menuList");
            return;
        }
        this._menuList = menuList;
    }

    findLowestPrice() {
        return this._menuList.reduce((min, current) => {
            if (current.price < min.price) {
                return current;
            } else {
                return min;
            }
        }).price;
    }

}
