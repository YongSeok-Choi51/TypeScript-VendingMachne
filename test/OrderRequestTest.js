const axios = require('axios');
let data = JSON.stringify({
    "productId": 2,
    "vendingMachineId": 1,
    "paymentType": "cash",
    "price": 5000,
    "userId": 2600
});

let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: 'localhost:3000/order',
    headers: {
        'Content-Type': 'application/json'
    },
    data: data
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
