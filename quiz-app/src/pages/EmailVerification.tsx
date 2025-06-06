import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api/config";

export const EmailVerification = () => {
    const [params] = useSearchParams();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = params.get("token");
        if (token) {
            axios.get(`${API_URL}/auth/verify?token=${token}`)
                .then(res => setMessage(res.data))
                .catch(() => setMessage("Nieprawidłowy lub wygasły token"));
        }
    }, [params]);

    return <p>{message}</p>;
};
