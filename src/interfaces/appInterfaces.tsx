export interface LoginResponse {
    user: User;
    token: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    role: string;
    state: boolean;
    name: string;
    lastName: string;
    email: string;
    uid: string;
}
export interface Client {
    uid: string;
    name: string;
    dateOfBirth: string;
    gender: string;
    ndisNumber: string;
    emergencyContact: string;
    ndisGoals: string;
    assessment: string;
    supportNetwork: string;
    state: boolean;
}