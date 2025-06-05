import {useEffect, useState} from "react";
import {DashboardLayout} from "../layouts/DashboardLayout";
import axios from "axios";
import {useAuth} from "../auth/AuthContext";
import {useNavigate} from "react-router-dom";


interface Tournament {
    id: number;
    quizId: number;
    quizTitle: string;
    startTime: string;
    endTime: string;
}

export const Tournaments = () => {
    const navigate = useNavigate();
    const {token} = useAuth();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/tournaments/active", {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setTournaments(res.data);
            } catch (err) {
                console.error("Błąd ładowania turniejów:", err);
            }
        };
        fetchTournaments();
    }, [token]);

    const handleJoin = (quizId: number, tournamentId: number) => {
        navigate(`/play/${quizId}?tournamentId=${tournamentId}`);
    };

    const handleLeaderboard = (tournamentId: number) => {
        navigate(`/tournament/${tournamentId}/leaderboard`);
    };

    return (
        <DashboardLayout>
            <h2>Aktywne Turnieje</h2>
            {tournaments.length === 0 ? (
                <p>Brak aktywnych turniejów.</p>
            ) : (
                <ul style={{listStyle: "none", padding: 0}}>
                    {tournaments.map(t => (
                        <li key={t.id} style={{
                            marginBottom: "1rem",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            padding: "1rem"
                        }}>
                            <h3>{t.quizTitle}</h3>
                            <p><strong>Od:</strong> {new Date(t.startTime).toLocaleString()}</p>
                            <p><strong>Do:</strong> {new Date(t.endTime).toLocaleString()}</p>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                gap: "1rem",
                                marginTop: "1rem"
                            }}>
                                <button className="form-button" onClick={() => handleJoin(t.quizId, t.id)}>Weź udział
                                </button>
                                <button className="form-button" onClick={() => handleLeaderboard(t.id)}>Sprawdź wyniki
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </DashboardLayout>
    );
};
