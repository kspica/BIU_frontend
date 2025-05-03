import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const ResetPasswordForm = () => {
    const [params] = useSearchParams();
    const token = params.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setMessage("Hasła nie są zgodne.");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/auth/reset-password`, null, {
                params: { token, newPassword: password },
            });
            setMessage("Hasło zostało zmienione.");
        } catch {
            setMessage("Nie udało się zresetować hasła.");
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>Ustaw nowe hasło</h2>
            <input
                type="password"
                placeholder="Nowe hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Powtórz hasło"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
            />
            <button type="submit">Zmień hasło</button>
            {message && <p className="success">{message}</p>}
        </form>
    );
};
