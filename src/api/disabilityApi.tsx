import axios from 'axios';

// const baseURL = 'http://localhost:8080/api';
const baseURL = 'http://10.0.0.86:8080/api';

const disabilityApi = axios.create({ baseURL });


export default disabilityApi;