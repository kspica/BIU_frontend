import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "../auth/AuthContext";
import {login as loginService} from "../api/authService";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../api/config";

export const LoginForm = () => {
    const {login} = useAuth();
    const {t} = useTranslation();
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
            setError(t('login.invalid'));
        }
    };

    return (
        <form className="form" onSubmit={handleLogin}>
            <h2>{t('login.title')}</h2>
            {error && <p className="error">{error}</p>}
            <input
                type="text"
                placeholder={t('login.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <a href={`${BASE_URL}/oauth2/authorization/google`}>
                <button type="button">{t('login.google')}</button>
            </a>
            <button type="submit">{t('login.submit')}</button>
            <button onClick={() => navigate("/forgot-password")}>
                {t('login.resetPassword')}
            </button>
            <button onClick={() => navigate("/register")}>
                {t('login.register')}
            </button>
        </form>
    );
};
