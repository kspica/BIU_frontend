import {API_URL} from "./config";
import api from "./axiosInterceptor";

const AUTH_URL = `${API_URL}/auth`;

export const login = async (username: string, password: string): Promise<string> => {
    const response = await api.post<{ token: string }>(`${AUTH_URL}/login`, {
        username,
        password,
    });
    return response.data.token;
};

export const register = async (username: string, password: string): Promise<string> => {
    const response = await api.post<{ token: string }>(`${AUTH_URL}/register`, {
        username,
        password,
    });
    return response.data.token;
};
