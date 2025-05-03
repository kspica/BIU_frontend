import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";

export const OAuth2Success = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        console.log('TOKEN' + token);
        if (!token) return;

        login(token);
        navigate("/dashboard");

    }, [login, navigate]);

    return <p>Logowanie przez Google...</p>;
};
