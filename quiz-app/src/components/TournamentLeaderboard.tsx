import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {useTranslation} from "react-i18next";
import api from "../api/axiosInterceptor";

interface LeaderboardEntry {
    username: string;
    score: number;
}

export const TournamentLeaderboard = () => {
    const {tournamentId} = useParams();
    const {t} = useTranslation();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get(`/tournaments/${tournamentId}/leaderboard`);
                setEntries(res.data);
            } catch (err) {
                console.error("Leaderboard error:", err);
                setError("Nie udało się pobrać wyników turnieju.");
            }
        };

        fetchLeaderboard();
    }, [tournamentId]);
    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">{t('tournamentLeaderboard.title', {id: tournamentId})}</h2>
                {error ? (
                    <p className="error">{error}</p>
                ) : entries.length === 0 ? (
                    <p>{t('tournamentLeaderboard.none')}</p>
                ) : (
                    <table className="table-layout">
                        <thead className="table-header">
                        <tr>
                            <th className="table-cell">{t('tournamentLeaderboard.place')}</th>
                            <th className="table-cell">{t('tournamentLeaderboard.user')}</th>
                            <th className="table-cell">{t('tournamentLeaderboard.score')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((entry, i) => (
                            <tr key={i}>
                                <td className="table-cell">{i + 1}</td>
                                <td className="table-cell">{entry.username}</td>
                                <td className="table-cell">{entry.score}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};
