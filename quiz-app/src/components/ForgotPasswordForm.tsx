import { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/config";

export const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [info, setInfo] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/auth/forgot-password`, email, {
                headers: { "Content-Type": "text/plain" },
            });
            setInfo("Link do resetu hasła został wysłany na e-mail.");
        } catch {
            setInfo("Nie udało się wysłać e-maila.");
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>Odzyskiwanie hasła</h2>
            <input
                type="email"
                placeholder="Twój e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Wyślij link resetujący</button>
            {info && <p className="success">{info}</p>}
        </form>
    );
};
