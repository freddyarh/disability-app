import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_URL_DEV } from '@env';

const baseURL = EXPO_PUBLIC_URL_DEV;
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