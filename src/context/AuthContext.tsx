
import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import disabilityApi from "../api/disabilityApi";
import { LoginResponse, LoginData, User } from "../interfaces/appInterfaces";
import { authReducer, AuthState } from "./authReducer";
import { Alert } from "react-native";


type AuthContextProps = {
    errorMessage: string;
    token: string;
    user: User | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    forgotId: string;
    signUp: ( user: User ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: '',
    forgotId: ''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState);

    useEffect(() => {
      
        checkToken();

    }, [])

    const checkToken = async() => {
        const token = await AsyncStorage.getItem('token');
        
        // Not token, not authenticate
            if( !token ) return dispatch({ type: 'notAuthenticated' });
        //There is token
        disabilityApi.get('/auth')
            .then(async(resp) => {
                if( resp.status !== 200 ){
                    return dispatch({ type: 'notAuthenticated' });
                }

                await AsyncStorage.setItem('token', resp.data.token);

                dispatch({
                    type: 'signUp',
                    payload: {
                        token: resp.data.token,
                        user: resp.data.user
                    }
                })
            })
            .catch(err => {
                console.log('err ', err.response.data.msg);
                return dispatch({ type: 'notAuthenticated' });
            });
    }
    

    const signUp = async({ name, lastName, email, password, role }: User ) => {
        
        try {

            const { data } = await disabilityApi.post<User>('/users/createUser', { name, lastName, email, password, role });
            Alert.alert('Info', data?.msg);
            
        } catch (error: any) {

            console.log(error);
            Alert.alert('Invalid info', error.response.data.msg);
        }
    };
    const signIn = async({ email, password }: LoginData ) => {
        try {

            const { data } = await disabilityApi.post<LoginResponse>('/auth/login', { email, password });

            dispatch({ type: 'signUp', payload: {
                token: data.token,
                user: data.user
                }
            }) 

            await AsyncStorage.setItem('token', data.token);
            
        } catch (error: any) {

            dispatch({ type: 'addError',
                payload: error.response.data.msg || 'Incorrect information'
            })
        }
    };
    const logOut = async() => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    };
    const removeError = () => {
        dispatch({ type: 'removeError' });
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            { children }
        </AuthContext.Provider>
    )

}