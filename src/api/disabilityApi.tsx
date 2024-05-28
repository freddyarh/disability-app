import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_URL_DEV } from '@env';

// const baseURL = 'http://192.168.1.40:8080/api';   //IP4 Sharon
// const baseURL = 'http://192.168.217.107:8080/api';   //My phone wifi
const baseURL = 'http://10.0.0.86:8080/api'; // Alison IP
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