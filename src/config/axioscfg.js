const axios = require('axios').default;
const axiosconfig = {
    "baseURL" : "http://localhost:3000"
};
const requester = axios.create(axiosconfig);

export default requester;

//eof
