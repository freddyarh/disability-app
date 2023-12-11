import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_URL_DEV } from '@env';

// const baseURL = 'http://192.168.1.36:8080/api';   IP4 Sharon
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