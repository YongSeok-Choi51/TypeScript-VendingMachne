import { DefVMResource, VendingMachine, VendingMachine as VendingMachineEntity } from '../entity/machine/VendingMachine';
import { ProductEntity } from '../entity/product/Product';
import { ProductResourceEntity } from '../entity/product/ProductResource';
import { ResourceEntity } from '../entity/product/Resource';
import { OrderRepository } from '../repository/OrderRepository';
import TotalRepository from '../repository/TotalRepository';




export class VendingMachineService {

    orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async findVendingMachineById(vmId: number) {

    }


    async getVendingMachine() {

        const vm: VendingMachine = await TotalRepository.vm.readTemplate();
        if (!vm) {
            return await this.createNewVendingMachine();
        }

        const promiseResult = await Promise.all([
            TotalRepository.product.readTemplate(),
            TotalRepository.vmResource.readTemplate(vm._id)
        ]);

        const productList = promiseResult[0];
        const vmResourceList = promiseResult[1];
        vm._vmResource = vmResourceList;
        vm._menuList = productList;
        await this.checkAvailableMenuList(vm);
        return vm;
    }

    async createNewVendingMachine() {
        const promiseResult = await Promise.all([
            TotalRepository.product.readTemplate(),
            TotalRepository.vm.createTemplate(),
            TotalRepository.defaultVmResource.readTemplate(),
        ]);

        const productList: Array<ProductEntity> = promiseResult[0];
        const newVendingMachine: VendingMachineEntity = promiseResult[1];
        const defaultResourceList: Array<DefVMResource> = promiseResult[2];

        newVendingMachine._menuList = productList;
        newVendingMachine._vmResource = await TotalRepository.vmResource.initDefaultResource(defaultResourceList, newVendingMachine._id);
        return newVendingMachine;
    }

    async makeBeverage(product: ProductEntity, vm: VendingMachine) {
        const productResourceList: Array<ProductResourceEntity> = await this.isMenuAvailable(product, vm);
        if (productResourceList.length === 0) {
            console.log("This Menu unAvailable..!");
            return;
        }

        const orderResult = await this.makeOrder(product, vm);

        console.log("");
        console.log(`********* Order result:${orderResult} *********`);
        console.log(`Menu: ${product.name}, Price: ${product.price}`);
        console.log("********* Start Make *********");
        const allResourceName: Array<ResourceEntity> = await TotalRepository.resource.readTemplate();
        const newVmResource = vm._vmResource.map(e => {
            const targetResource = productResourceList.filter(el => el.resourceId === e.resourceId);
            if (targetResource.length === 0) {
                return e;
            } else {
                const resourceName = allResourceName.filter(elem => elem.id === e.resourceId)[0].name;
                console.log(`${resourceName} is successfully added!`);
                return ({ ...e, amount: e.amount - targetResource[0].amount });
            }
        });
        vm._vmResource = newVmResource;
        await Promise.all([
            TotalRepository.vmResource.onFinishTransaction(newVmResource),
            this.checkAvailableMenuList(vm),
        ]);
        console.log("********* End Make *********");
    }

    private async checkAvailableMenuList(vm: VendingMachine) {
        const allProduct: Array<ProductEntity> = await TotalRepository.product.readTemplate();
        let notAvailableProductList: Array<ProductEntity> = [];

        for (let i of allProduct) {
            const productResourceList: Array<ProductResourceEntity> = await TotalRepository.productResource.readTemplate(i.id);
            const notAvailableProduct = productResourceList.filter(el => vm._vmResource.filter(elem => elem.resourceId === el.resourceId && elem.amount < el.amount).length > 0);
            if (notAvailableProduct.length > 0) {
                notAvailableProductList.push(i);
            }
        }

        let newMenuList = [...vm._menuList];
        notAvailableProductList.forEach(menu => {
            const targetIdx = newMenuList.findIndex(el => el.id === menu.id);
            if (targetIdx !== -1) {
                newMenuList[targetIdx].isAvailable = false;
            }
        });
        vm._menuList = newMenuList;
    }

    private async makeOrder(product: ProductEntity, vm: VendingMachineEntity) {
        return await TotalRepository.order.createTemplate({ vendingMachineId: vm._id, productId: product.id, amount: 1, price: product.price });
    }

    private async isMenuAvailable(product: ProductEntity, vm: VendingMachineEntity) {
        const productResourceList: Array<ProductResourceEntity> = await TotalRepository.productResource.readTemplate(product.id);
        const notEnoughResource = productResourceList.filter(e => vm._vmResource.filter(el => el.resourceId === e.resourceId && el.amount < e.amount).length >= 1);
        if (notEnoughResource.length > 0) {
            return [];
        }
        return productResourceList;
    }
}

   // 스트림으로 처리하려면 어떻게?
        // await (async () => {
        //     notAvailableProductList = allProduct.filter(async e => {
        //         const productResourceList: Array<ProductResourceEntity> = await TotalRepository.productResource.readTemplate(e.id);
        //         const notAvailableProduct = productResourceList.filter(el => vm._vmResource.filter(elem => elem.resourceId === el.resourceId && elem.amount < el.amount).length > 0);
        //         console.log("notAvailableProduct", notAvailableProduct);
        //         if (notAvailableProduct.length > 0) {
        //             return e;
        //         }
        //     });
        // })();