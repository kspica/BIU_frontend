import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (username: string, password: string): Promise<string> => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data; // token
};

export const register = async (username: string, password: string): Promise<string> => {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    return response.data; // token
};
