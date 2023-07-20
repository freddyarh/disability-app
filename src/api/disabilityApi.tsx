import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const baseURL = 'http://localhost:8080/api';
const baseURL = 'http://10.0.0.86:8080/api';

const disabilityApi = axios.create({ baseURL });

disabilityApi.interceptors.request.use(

    async(config) => {
        const token = await AsyncStorage.getItem('token');
        if( token ){
            config.headers['auth-token'] = token;
        }
        return config;
    }
)


export default disabilityApi;