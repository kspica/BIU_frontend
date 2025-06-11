import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import api from "../api/axiosInterceptor";

export const EmailVerification = () => {
    const [params] = useSearchParams();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = params.get("token");
        if (token) {
            api.get(`/auth/verify?token=${token}`)
                .then(res => setMessage(res.data))
                .catch(() => setMessage("Nieprawidłowy lub wygasły token"));
        }
    }, [params]);

    return <p>{message}</p>;
};
