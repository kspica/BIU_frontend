import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSearchParams} from "react-router-dom";
import api from "../api/axiosInterceptor";

export const ResetPasswordForm = () => {
    const [params] = useSearchParams();
    const token = params.get("token");

    const {t} = useTranslation();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setMessage(t('reset.mismatch'));
            return;
        }

        try {
            await api.post("/auth/reset-password", null, {
                params: {
                    token,
                    newPassword: password,
                },
            });
            setMessage(t('reset.success'));
        } catch {
            setMessage(t('reset.failure'));
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>{t('reset.title')}</h2>
            <input
                type="password"
                placeholder={t('reset.newPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder={t('reset.confirmPassword')}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
            />
            <button type="submit">{t('reset.submit')}</button>
            {message && <p className="success">{message}</p>}
        </form>
    );
};
