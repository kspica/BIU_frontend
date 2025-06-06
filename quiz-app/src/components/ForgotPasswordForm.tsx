import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "../api/config";

export const ForgotPasswordForm = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [info, setInfo] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/auth/forgot-password`, email, {
                headers: { "Content-Type": "text/plain" },
            });
            setInfo(t('forgot.success'));
        } catch {
            setInfo(t('forgot.failure'));
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>{t('forgot.title')}</h2>
            <input
                type="email"
                placeholder={t('forgot.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">{t('forgot.submit')}</button>
            {info && <p className="success">{info}</p>}
        </form>
    );
};
