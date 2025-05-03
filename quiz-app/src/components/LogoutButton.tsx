import {useAuth} from "../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import MyIcon from "../assets/icons/logout.svg";

export const LogoutButton = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return <button className="icon-button" onClick={handleLogout}>
        <img src={MyIcon} alt="Ikona"/>
    </button>;
};