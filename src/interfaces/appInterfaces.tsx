export interface LoginResponse {
    user: User;
    token: string;
};

export interface LoginData {
    email: string;
    password: string;
};

export interface User {
    role: string;
    state?: boolean;
    name: string;
    lastName: string;
    email: string;
    password?: string;
    uid?: string;
};

export interface Client {
    client: {
        _id:              ID;
        name:             string;
        dateOfBirth:      string;
        gender:           string;
        ndisNumber:       number;
        emergencyContact: number;
        ndisGoals:        string;
        assessment:       string;
        supportNetwork:   string;
        user:             ID[];
        __v:              number;
    }
};

export interface ClientForm {
    _id:           ID;
    clientId:      ID;
    date:          string;
    activity:      string;
    functionality: string;
    prompt:        string;
    behaviour:     Behaviour[];
    comment:       string;
};

export interface ID {
    $oid: string;
};

export interface Behaviour {
    name: string;
    _id:  ID;
};