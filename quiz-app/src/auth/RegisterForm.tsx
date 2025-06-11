import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import { API_URL } from "../api/config";
import api from "../api/axiosInterceptor";

export const RegisterForm = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const checkUsername = setTimeout(() => {
            if (username.length >= 3) {
                api
                    .get(`/auth/check-username?username=${username}`)
                    .then(() => setUsernameError(""))
                    .catch(() => setUsernameError(t('register.usernameTaken')));
            }
        }, 500);

        return () => clearTimeout(checkUsername);
    }, [username, t]);

    useEffect(() => {
        const checkEmail = setTimeout(() => {
            if (email.includes("@")) {
                axios
                    .get(`${API_URL}/auth/check-email?email=${email}`)
                    .then(() => setEmailError(""))
                    .catch(() => setEmailError(t('register.emailTaken')));
            }
        }, 500);

        return () => clearTimeout(checkEmail);
    }, [email, t]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!username || !email || !password || !confirmPassword) {
            setFormError(t('register.required'));
            return;
        }

        if (password !== confirmPassword) {
            setFormError(t('register.mismatch'));
            return;
        }

        if (password.length < 6) {
            setFormError(t('register.passwordLength'));
            return;
        }

        if (usernameError || emailError) {
            setFormError(t('register.formErrors'));
            return;
        }

        try {
            await api.post("/auth/register", {
                username,
                email,
                password,
            });
            setMessage(t('register.success'));
        } catch (e) {
            setFormError(t('register.error', 'B\u0142\u0105d podczas rejestracji.'));
        }
    };

    return (
        <form className="form" onSubmit={handleRegister}>
            <h2>{t('register.title')}</h2>
            <input
                type="text"
                placeholder={t('register.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <p className="error">{usernameError}</p>}
            <input
                type="email"
                placeholder={t('register.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error">{emailError}</p>}
            <input
                type="password"
                placeholder={t('register.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder={t('register.confirm')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {formError && <p className="error">{formError}</p>}
            <button type="submit">{t('register.submit')}</button>
            {message && <p className="success">{message}</p>}
        </form>
    );
};
