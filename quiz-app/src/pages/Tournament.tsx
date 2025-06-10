import {useEffect, useState} from "react";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {useAuth} from "../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import api from "../api/axiosInterceptor";


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
    const {t} = useTranslation();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await api.get("/tournaments/active");
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
            <h2>{t('tournaments.title')}</h2>
            {tournaments.length === 0 ? (
                <p>{t('tournaments.none')}</p>
            ) : (
                <ul className="list-reset">
                    {tournaments.map(tournament => (
                        <li key={tournament.id} className="list-item-lg">
                            <h3>{tournament.quizTitle}</h3>
                            <p><strong>Od:</strong> {new Date(tournament.startTime).toLocaleString()}</p>
                            <p><strong>Do:</strong> {new Date(tournament.endTime).toLocaleString()}</p>
                            <div className="button-row">
                                <button className="form-button"
                                        onClick={() => handleJoin(tournament.quizId, tournament.id)}>{t('tournaments.join')}
                                </button>
                                <button className="form-button"
                                        onClick={() => handleLeaderboard(tournament.id)}>{t('tournaments.results')}
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </DashboardLayout>
    );
};
