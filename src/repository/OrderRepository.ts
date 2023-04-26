import { ResultSetHeader } from 'mysql2/promise';
import { PionRepository } from './PionRepository';
import { Order } from '../entity/order/Order';


export enum PaymentType {
    CASH = "cash",
    CARD = "card"
}

export interface OrderEntity {
    id: number;
    vendingMachineId: number;
    productId: number;
    amount: number;
    price: number;
}

export interface OrderDto {
    vendingMachineId: number;
    productId: number;
    amount: number;
    price: number;
}

// 커넥션을 어떻게 관리? 동일커넥션을 사용하고, 풀에다가 반납을 템플릿 형태로 할 수 없을까? 
export class OrderRepository extends PionRepository<Order> {


    save(entity: Order): Promise<Order> {
        throw new Error('Method not implemented.');
    }
    saveAll(): Promise<number> {
        throw new Error('Method not implemented.');
    }


    findById(id: number): Promise<Order> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }
    updateById(id: number, valueList: Order[]): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }
    deleteById(id: number): Promise<number> {
        throw new Error('Method not implemented.');
    }
    createTemplate() {
        throw new Error('Method not implemented.');
    }


    // async createTemplate(orderDto: OrderDto) {
    //     const createOrderQuery = `
    //         INSERT INTO 
    //             pixar.order (
    //                 vending_machine_id,
    //                 product_id,
    //                 payment_type,
    //                 amount,
    //                 total_price,
    //                 created_at,
    //                 created_by
    //             )
    //         VALUES(?, ?, ?, ?, ?, ?, ?)
    //     `;

    //     // 결제수단, 구매자Id 정보는 임시적으로 상수로 고정, 단건판매 기준(한 잔의 음료 판매에 대한 data)
    //     const [resultSetHeader, _] = await this._connection.query({ sql: createOrderQuery }, [
    //         orderDto.vendingMachineId,
    //         orderDto.productId,
    //         PaymentType.CASH,
    //         orderDto.amount,
    //         orderDto.price,
    //         new Date(),
    //         1
    //     ]);
    //     return resultSetHeader && (resultSetHeader as ResultSetHeader).affectedRows > 0;
    // }

    readTemplate() {

    }

    updateTemplate() {

    }


}