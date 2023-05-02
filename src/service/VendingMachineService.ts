import { OrderRepository } from './../repository/OrderRepository';
import { PoolConnection } from 'mysql2/promise';
import { VendingMachine } from '../entity/machine/VendingMachine';
import { VendingMachineResource } from '../entity/machine/VendingMachineResource';
import { ProductEntity } from '../entity/product/Product';
import { DefaultVendingMachineResourceRepository } from '../repository/DefaultVendingMachineResourceRepository';
import { ProductRepository } from '../repository/ProductRepository';
import { VendingMachineRepository } from '../repository/VendingMachineRepository';
import { VendingMachineResourceRepository } from '../repository/VendingMachineResourceRepository';
import { ProductResource, ProductResourceEntity } from '../entity/product/ProductResource';
import { ProductResourceRepository } from '../repository/ProductResourceRepository';
import { ProductOrderInput } from '../app';
import { Order, PAYMENT_TYPE } from '../entity/order/Order';




export class VendingMachineService {

    vendingMachineRepository: VendingMachineRepository;
    vendingMachineResourceRepository: VendingMachineResourceRepository;
    defaultVendingMachineResourceRepository: DefaultVendingMachineResourceRepository;
    productRepository: ProductRepository;
    productResourceRepository: ProductResourceRepository;
    orderRepository: OrderRepository;

    constructor() {
        this.vendingMachineRepository = new VendingMachineRepository();
        this.vendingMachineResourceRepository = new VendingMachineResourceRepository();
        this.defaultVendingMachineResourceRepository = new DefaultVendingMachineResourceRepository();
        this.productRepository = new ProductRepository();
        this.productResourceRepository = new ProductResourceRepository();
        this.orderRepository = new OrderRepository();
    }

    async getVendingMachine(id: number, conn: PoolConnection) {

        const vm: VendingMachine = await this.vendingMachineRepository.findById(id, conn);

        // 특정 id값으로 조회되지 않는 경우 새로 만들어 반환
        if (!vm) {
            return await this.createNewVendingMachine(id, conn);
        }

        // 전체메뉴, 특정VM이 판매 불가능한 메뉴, VM 리소스 조회
        const [allProductList, unAvailableProductList, vmResourceList] = await Promise.all([
            this.productRepository.findAll(conn),
            this.vendingMachineResourceRepository.findUnAvailableProductsByVmId(vm.id, conn),
            this.vendingMachineResourceRepository.findById(id, conn)
        ]);

        // 판매 가능한 메뉴, 자판기 가용 자원 초기화 하여 반환
        vm.vmResource = vmResourceList;
        vm.menuList = this.getAvailableProduct(allProductList, unAvailableProductList);
        return vm;
    }

    async createNewVendingMachine(id: number, conn: PoolConnection) {

        const newVendingMachine = await this.vendingMachineRepository.save(new VendingMachine(id, undefined!), conn);

        // 기본 리소스, 메뉴 조회하여 초기화 후 반환
        const [productList, defaultResourceList] = await Promise.all([
            this.productRepository.findAll(conn),
            this.defaultVendingMachineResourceRepository.findAll(conn)
        ]);

        const vendingMachineResourceList = defaultResourceList.map(e => new VendingMachineResource(e.resourceId, id, e.amount));
        const affectedRows = await this.vendingMachineResourceRepository.saveAll(vendingMachineResourceList, conn);

        if (affectedRows === 0) {
            throw new Error("vendingMachineResource insert Fail");
        }

        newVendingMachine.menuList = productList;
        newVendingMachine.vmResource = vendingMachineResourceList;
        return newVendingMachine;
    }


    async saleBeverage(requestBody: ProductOrderInput, conn: PoolConnection) {

        const product = await this.productRepository.findById(requestBody.productId, conn);
        // const vm = await this.vendingMachineRepository.findById(requestBody.vendingMachineId, conn);
        const vm = await this.getVendingMachine(requestBody.vendingMachineId, conn);

        if (product.price > requestBody.price) {
            throw new Error("not enough cost");
        }

        await this.makeBeverage(product, vm, conn);
        const isOrderCreated = await this.makeOrder(product, vm, conn);

        if (isOrderCreated) {
            const remain = requestBody.price - product.price;
            return { isOrderCreated, remain };
        }

        return { isOrderCreated: false };
    }

    private getAvailableProduct(allProducts: Array<ProductEntity>, unAvailableProducts: Array<{ productId: number; }>) {
        let availableProductList: Array<ProductEntity> = [];
        unAvailableProducts.forEach(unAvailable => {
            availableProductList = allProducts.filter(product => product.id !== unAvailable.productId);
        });
        return availableProductList;
    }

    async makeBeverage(product: ProductEntity, vm: VendingMachine, conn: PoolConnection) {

        const productResourceList: Array<ProductResourceEntity> = await this.isMenuAvailable(product, vm, conn);
        if (productResourceList.length === 0) {
            throw new Error("not enough material");
        }

        const newVmResource = vm.vmResource.map(e => {
            const targetResource = productResourceList.filter(el => el.resourceId === e.resourceId);
            if (targetResource.length === 0) {
                return e;
            } else {
                return ({ ...e, amount: e.amount - targetResource[0].amount });
            }
        });

        const [allProductList, unAvailableProductList] = await Promise.all([
            this.productRepository.findAll(conn),
            this.vendingMachineResourceRepository.findUnAvailableProductsByVmId(vm.id, conn)
        ]);

        vm.vmResource = newVmResource;
        vm.menuList = this.getAvailableProduct(allProductList, unAvailableProductList);
        await this.vendingMachineResourceRepository.updateById(vm.id, vm.vmResource, conn);
    }

    private async makeOrder(product: ProductEntity, vm: VendingMachine, conn: PoolConnection) {
        const amount = 1;
        const totalPrice = amount * product.price;

        const newOrder = new Order(vm.id, product.id, PAYMENT_TYPE.CASH, amount, totalPrice, new Date(), 2600);
        const result = await this.orderRepository.save(newOrder, conn);

        if (result.id) {
            return true;
        } else {
            return false;
        }
    }

    private async isMenuAvailable(product: ProductEntity, vm: VendingMachine, conn: PoolConnection) {
        const productResourceList = (await this.productResourceRepository.findById(product.id, conn)) as Array<ProductResource>;
        console.log("result", productResourceList);
        console.log("vm", vm);

        let isMakable = true;
        for (const productResource of productResourceList) {
            // 특정 제품의 1개 이상의 자원이 vm resource에서 가용하지 않는 경우, 빈 제품 리소스 배열 반환, 제조 가능하다면 리소스 배열 반환
            if (vm.vmResource.filter(vmResource => vmResource.resourceId === productResource.resourceId && vmResource.amount < productResource.amount).length > 0) {
                isMakable = false;
                break;
            }
        }
        if (!isMakable) {
            return [];
        }
        return productResourceList;
    }
}