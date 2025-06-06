import {useState, useEffect} from "react";
import axios from "axios";

export const RegisterForm = () => {
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
                axios
                    .get(`http://localhost:8080/api/auth/check-username?username=${username}`)
                    .then(() => setUsernameError(""))
                    .catch(() => setUsernameError("Nazwa użytkownika jest zajęta"));
            }
        }, 500);

        return () => clearTimeout(checkUsername);
    }, [username]);

    useEffect(() => {
        const checkEmail = setTimeout(() => {
            if (email.includes("@")) {
                axios
                    .get(`http://localhost:8080/api/auth/check-email?email=${email}`)
                    .then(() => setEmailError(""))
                    .catch(() => setEmailError("E-mail jest już zarejestrowany"));
            }
        }, 500);

        return () => clearTimeout(checkEmail);
    }, [email]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!username || !email || !password || !confirmPassword) {
            setFormError("Wszystkie pola są wymagane.");
            return;
        }

        if (password !== confirmPassword) {
            setFormError("Hasła się nie zgadzają.");
            return;
        }

        if (password.length < 6) {
            setFormError("Hasło musi mieć co najmniej 6 znaków.");
            return;
        }

        if (usernameError || emailError) {
            setFormError("Popraw błędy formularza.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/auth/register", {
                username,
                email,
                password,
            });
            setMessage("Sprawdź skrzynkę e-mail");
        } catch (e) {
            setFormError("Błąd podczas rejestracji.");
        }
    };

    return (
        <form className="form" onSubmit={handleRegister}>
            <h2>Rejestracja</h2>
            <input
                type="text"
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <p className="error">{usernameError}</p>}
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error">{emailError}</p>}
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Powtórz hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {formError && <p className="error">{formError}</p>}
            <button type="submit">Zarejestruj się</button>
            {message && <p className="success">{message}</p>}
        </form>
    );
};
