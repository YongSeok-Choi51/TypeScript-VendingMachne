import * as readlinePromise from 'readline/promises';
import * as process from 'process';
import { VendingMachine } from './entity/machine/VendingMachine';
import BeverageSaleService from './service/BeverageSaleService';


let userAnswer: string = "";
let userAmount: number = 0;
const VENDING_MACHINE_LIST: Array<VendingMachine> = [];
const rl = readlinePromise.createInterface({
    input: process.stdin,
    output: process.stdout,
});




const getUserInput = async (guideLine: string) => {
    return await rl.question(guideLine);
};

const calculateRemain = (userAmount: number) => {
    let total = userAmount;
    const coin = [500, 100, 50, 10, 1];

    let result = "** 잔돈 **";
    coin.forEach(e => {
        const quotient = Math.floor(total / e);
        total -= quotient * e;
        result += `\n${e}원 ${quotient}개`;
    });
    return result + "\n** * * **";
};

const initVendingMachine = async () => {
    const vm = await BeverageSaleService.vmManageService.getVendingMachine();
    VENDING_MACHINE_LIST.push(vm); // 여러 개 사용할 가능성이 있음!
};

const showMenu = () => {
    console.log("");
    console.log("********* Menu List *********");
    console.log("*****************************");
    const availableMenu = VENDING_MACHINE_LIST[0]._menuList.filter(e => e.price <= userAmount && e.isAvailable === true);
    if (availableMenu.length > 0) {
        availableMenu.forEach((e, idx) => { console.log(`${idx + 1}. ${e.name}, Price: ${e.price}`); });
    } else {
        console.log("판매 가능한 메뉴가 존재하지 않습니다.");
        console.log("'x' 버튼을 눌러 잔돈을 반환하세요.");
    }
    console.log("*****************************");
    console.log(`현재금액 :${userAmount}`);
};

const saleBeverage = async () => {
    showMenu();

    const input = await getUserInput("메뉴의 이름을 입력해주세요 {종료하시려면 x 입력} -> ");
    if (input.trim().toLowerCase() === 'x') {
        userAnswer = 'n';
        return;
    }
    const selectedMenu = VENDING_MACHINE_LIST[0]._menuList.filter(e => e.name.replaceAll(" ", "").toLowerCase() === input.replaceAll(" ", "").toLowerCase());

    if (selectedMenu.length === 0) {
        console.log("메뉴판에 존재하는 메뉴를 골라주세요");
        return;
    }

    userAmount -= selectedMenu[0].price;
    await BeverageSaleService.vmManageService.makeBeverage(selectedMenu[0], VENDING_MACHINE_LIST[0]);
};



(async () => {
    try {
        userAnswer = await rl.question("자판기를 이용하시겠습니까? [Y/N] -> ");
        if (userAnswer?.trim().toLowerCase() !== 'n') {
            await initVendingMachine();
            userAmount = parseInt(await getUserInput("금액을 투입해주세요 -> "));

            while (userAmount > 0 && userAnswer?.trim().toLowerCase() !== 'n') {
                await saleBeverage();
            }
            if (userAmount > 0) {
                console.log(calculateRemain(userAmount));
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        rl.on("close", () => {
            console.log("이용해주셔서 감사합니다.");
            process.exit(0);
        });
        rl.close();
    }
})();