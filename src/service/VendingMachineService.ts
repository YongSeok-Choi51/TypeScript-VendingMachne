import { PoolConnection } from 'mysql2/promise';
import { ProductOrderInput } from '../app';
import { VendingMachine } from '../entity/machine/VendingMachine';
import { VendingMachineResource } from '../entity/machine/VendingMachineResource';
import { Order, PAYMENT_TYPE } from '../entity/order/Order';
import { Product } from '../entity/product/Product';
import { ProductResource } from '../entity/product/ProductResource';
import { DefaultVendingMachineResourceRepository } from '../repository/DefaultVendingMachineResourceRepository';
import { ProductRepository } from '../repository/ProductRepository';
import { ProductResourceRepository } from '../repository/ProductResourceRepository';
import { VendingMachineRepository } from '../repository/VendingMachineRepository';
import { VendingMachineResourceRepository } from '../repository/VendingMachineResourceRepository';
import { OrderRepository } from './../repository/OrderRepository';



export class VendingMachineService {

    private vendingMachineRepository: VendingMachineRepository;
    private vendingMachineResourceRepository: VendingMachineResourceRepository;
    private defaultVendingMachineResourceRepository: DefaultVendingMachineResourceRepository;
    private productRepository: ProductRepository;
    private productResourceRepository: ProductResourceRepository;
    private orderRepository: OrderRepository;

    // Service class 내부의 속성으로 repository 사용
    constructor() {
        this.vendingMachineRepository = new VendingMachineRepository();
        this.vendingMachineResourceRepository = new VendingMachineResourceRepository();
        this.defaultVendingMachineResourceRepository = new DefaultVendingMachineResourceRepository();
        this.productRepository = new ProductRepository();
        this.productResourceRepository = new ProductResourceRepository();
        this.orderRepository = new OrderRepository();
    }

    // id입력받아, 해당 자판기의 리소스 + 판매할 수 있는 메뉴 목록을 가져와서 반환
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

    private async createNewVendingMachine(id: number, conn: PoolConnection) {

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

        // 판매 음료 + 자판기 조회하여 입력 금액 비교 후 제조
        const product = await this.productRepository.findById(requestBody.productId, conn);
        const vm = await this.getVendingMachine(requestBody.vendingMachineId, conn);

        if (product.price > requestBody.price) {
            throw new Error("not enough cost");
        }

        await this.makeBeverage(product, vm, conn);
        const isOrderCreated = await this.makeOrder(product, vm, requestBody.userId, conn);

        if (isOrderCreated) {
            const remain = requestBody.price - product.price;
            return { isOrderCreated, remain };
        }

        return { isOrderCreated: false };
    }



    private async makeBeverage(product: Product, vm: VendingMachine, conn: PoolConnection) {

        const productResourceList: Array<ProductResource> = await this.isMenuAvailable(product, vm, conn);
        if (productResourceList.length === 0) {
            throw new Error("not enough material");
        }

        // 전체 목록에서, 상품에 해당하는 리소스만 차감 + DB Update
        const newVmResource = vm.vmResource.map(vmResource => {
            const targetResource = productResourceList.filter(productResource => productResource.resourceId === vmResource.resourceId);
            if (targetResource.length === 0) {
                return vmResource;
            } else {
                return ({ ...vmResource, amount: vmResource.amount - targetResource[0].amount });
            }
        });

        const affectedRows = await this.vendingMachineResourceRepository.updateById(vm.id, newVmResource, conn);

        if (affectedRows === 0) {
            throw new Error("makeBeverage vmResource Error");
        }

        // 음료 판매 이후, 자판기가 판매할 수 있는 상품목록 새로고침
        const [allProductList, unAvailableProductList] = await Promise.all([
            this.productRepository.findAll(conn),
            this.vendingMachineResourceRepository.findUnAvailableProductsByVmId(vm.id, conn)
        ]);

        vm.vmResource = newVmResource;
        vm.menuList = this.getAvailableProduct(allProductList, unAvailableProductList);
    }

    private getAvailableProduct(allProducts: Array<Product>, unAvailableProducts: Array<{ productId: number; }>) {
        let availableProductList: Array<Product> = [];

        if (unAvailableProducts.length === 0) {
            availableProductList = allProducts;
        } else {
            unAvailableProducts.forEach(unAvailable => {
                availableProductList = allProducts.filter(product => product.id !== unAvailable.productId);
            });
        }

        return availableProductList;
    }

    private async makeOrder(product: Product, vm: VendingMachine, useId: number, conn: PoolConnection) {

        // 하나의 주문에 한 잔만 판매하도록 지정 
        const amount = 1;
        const totalPrice = amount * product.price;

        const newOrder = new Order(vm.id, product.id, PAYMENT_TYPE.CASH, amount, totalPrice, new Date(), useId);
        const result = await this.orderRepository.save(newOrder, conn);

        if (result.id) {
            return true;
        } else {
            return false;
        }
    }

    private async isMenuAvailable(product: Product, vm: VendingMachine, conn: PoolConnection) {
        const productResourceList = await this.productResourceRepository.findById(product.id, conn);

        // 특정 제품의 1개 이상의 자원이 vm resource에서 가용하지 않는 경우, 빈 제품 리소스 배열 반환, 제조 가능하다면 리소스 배열 반환
        let isMakable = true;
        for (const productResource of productResourceList) {
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