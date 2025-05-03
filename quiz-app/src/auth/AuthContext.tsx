import React, { createContext, useContext, useState } from "react";

// Rozszerzony typ kontekstu
interface AuthContextType {
    token: string | null;
    user: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// Domyślny kontekst
const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: false,
});

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [user, setUser] = useState<string | null>(() => localStorage.getItem("username"));

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);

        try {
            const payloadBase64 = newToken.split('.')[1];
            const decoded = JSON.parse(atob(payloadBase64));
            const username = decoded?.sub || "użytkownik";
            setUser(username);
            localStorage.setItem("username", username);
        } catch (error) {
            console.error("Nie udało się odczytać nazwy użytkownika z tokena.");
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook
export const useAuth = () => useContext(AuthContext);
