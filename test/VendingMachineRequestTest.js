const axios = require('axios');
let data = '';

let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: 'localhost:3000/vm/170',
    headers: {},
    data: data
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
