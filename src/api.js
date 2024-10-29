import axios from 'axios';
 
const instance = axios.create({
    baseURL: 'https://dev287265.service-now.com/api/now/table/', // Replace with your ServiceNow instance URL
    headers: {
        'Content-Type': 'application/json',
        //'Authorization': 'Basic V2VicGFnZS5JbnRlZ3JhdGlvbjpXZWJ1c2VyQDEx', // Replace with your credentials
    },
    credentials: 'include',
});
 
 
export default instance;
