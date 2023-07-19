
import React, { createContext, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import disabilityApi from "../api/disabilityApi";
import { LoginResponse, LoginData, User } from "../interfaces/appInterfaces";
import { authReducer, AuthState } from "./authReducer";


type AuthContextProps = {
    errorMessage: string;
    token: string;
    user: User | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: () => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialStaate: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialStaate);

    const signUp = () => {};
    const signIn = async({ email, password }: LoginData ) => {
        try {

            const { data } = await disabilityApi.post<LoginResponse>('/auth/login', { email, password });

            dispatch({ type: 'signUp', payload: {
                token: data.token,
                user: data.user
                }
            }) 
            
        } catch (error) {

            dispatch({ type: 'addError',
                payload: error.response.data.msg || 'Incorrect information'
            })
        }
    };
    const logOut = () => {};
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