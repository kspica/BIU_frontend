import { LogoutButton } from "./LogoutButton";
import { useAuth } from "../auth/AuthContext";
import "../styles/topbar.scss"; // upewnij się, że ten plik istnieje

export const Topbar = () => {
    const { user } = useAuth();
    const displayName = user || "Użytkownik";

    return (
        <header className="topbar">
            <div className="topbar-right">
                <div className="user-info">
                    <img
                        src="https://i.pravatar.cc/40" // avatar na sztywno
                        alt="Avatar"
                        className="user-avatar"
                    />
                    <span className="user-name">{displayName}</span>
                </div>
                <LogoutButton />
            </div>
        </header>
    );
};
