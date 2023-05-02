import bodyParser from "body-parser";
import express from 'express';
import { PAYMENT_TYPE } from './entity/order/Order';
import { CONNECTION_POOL } from './repository/PionRepository';
import { VendingMachineService } from './service/VendingMachineService';



export interface ProductOrderInput {
    productId: number;
    vendingMachineId: number;
    paymentType: PAYMENT_TYPE;
    price: number;
    userId: number;
}



const app = express();
const port = 3000;
app.use(bodyParser.json());

const vendingMachineService = new VendingMachineService();

const getTransaction = async () => {
    const conn = await CONNECTION_POOL.getConnection();
    await conn.beginTransaction();
    return conn;
};

app.get("/menu", (req, res) => {

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
        const requestBody: ProductOrderInput = req.body;
        const orderResult = await vendingMachineService.saleBeverage(requestBody, conn);
        res.status(200).send(orderResult);
        conn.commit();
    } catch (err) {
        console.log("order err", err);
        conn.rollback();
    } finally {
        try {
            conn.release();
        } catch (err) {
            console.log("connection release err", err);
        }
    }
});


app.listen(port, () => {
    console.log("Server is running on Localhost");
});

