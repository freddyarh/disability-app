
import React, { createContext, useReducer } from "react";
import { LoginData, Usuario } from "../interfaces/appInterfaces";
import { authReducer, AuthState } from "./authReducer";


type AuthContextProps = {
    errorMessage: string;
    token: string;
    user: Usuario | null;
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
            if( email === "fredy@gmail.com" && password === "123456" ){
                dispatch({ type: 'signUp', 
                    payload: {
                        token: "token123456",
                        user: {
                            role: "USER",
                            state: true,
                            name: "Fredy",
                            lastName: "Aristizabal",
                            email: "fredy@gmail.com",
                            uid: "uid123456"
                        }
                }})
            }else{
                dispatch({ type: 'addError',
                    payload: 'Information incorrect'
                })
            }
            
        } catch (error) {
            
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