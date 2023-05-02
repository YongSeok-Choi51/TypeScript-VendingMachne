import { PAYMENT_TYPE } from './entity/order/Order';
import { VendingMachineService } from './service/VendingMachineService';
import bodyParser from "body-parser";
import express from 'express';
import { CONNECTION_POOL } from './repository/PionRepository';
import { VendingMachineRepository } from './repository/VendingMachineRepository';


// vm 조회 및 생성
// vm 리소스 조회 
// 메뉴 와 자원을 조회하는거 (벤딩머신에서 만들 수 있는 )

// 주문 하는 api가 필요하다..!  (주문 성공 실패 + 잔돈은 얼마다(성공시에))
const app = express();
const port = 3000;

const vendingMachineRepo = new VendingMachineRepository();
const vendingMachineService = new VendingMachineService();

export interface ProductOrderInput {
    productId: number;
    vendingMachineId: number;
    paymentType: PAYMENT_TYPE;
    price: number;
}

const getTransaction = async () => {
    const conn = await CONNECTION_POOL.getConnection();
    await conn.beginTransaction();
    return conn;
};


app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("hello world!");
});

app.post("/body", (req, res) => {
    console.log("the body", req.body.name);
    res.send("you're send with body " + req.body.name);
});

// all menu
app.get("/menu/:vmId", (req, res) => {
    console.log("vmId" + req.params.vmId);
});

app.put("/vm/:id", async (req, res) => {
    const conn = await getTransaction();
    try {
        const vmId = parseInt(req.params.id);
        const result = await vendingMachineService.getVendingMachine(vmId, conn);
        res.status(200).send({ result });
        conn.commit();
    } catch (err) {
        console.log("err", err);
        conn.rollback();
    } finally {
        try {
            conn.release();
        } catch (error) {
            console.log("connection release error", error);
        }
    }
});

app.put("/order", async (req, res) => {

    const conn = await CONNECTION_POOL.getConnection();
    await conn.beginTransaction();
    try {

    } catch (err) {

    }


    const { productId, vendingMachineId, paymentType, price } = req.body;

    console.log("inputs", productId, vendingMachineId, paymentType, price);
    res.send({ vendingMachineId: 12, result: true, remain: 5000 });
});


app.listen(port, () => {
    console.log("Server is running on Localhost");
});

