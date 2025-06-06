import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { login as loginService } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/config";

export const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await loginService(username, password);
            login(token);
            navigate("/dashboard");
        } catch (err) {
            setError("Nieprawidłowe dane logowania.");
        }
    };

    return (
        <form className="form" onSubmit={handleLogin}>
            <h2>Zaloguj się</h2>
            {error && <p className="error">{error}</p>}
            <input
                type="text"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <a href={`${BASE_URL}/oauth2/authorization/google`}>
                <button type="button">Zaloguj się przez Google</button>
            </a>
            <button type="submit">Zaloguj</button>
            <button onClick={() => navigate("/forgot-password")}>
                Zresetuj hasło
            </button>
            <button onClick={() => navigate("/register")}>
                Zarejestruj się
            </button>
        </form>
    );
};
