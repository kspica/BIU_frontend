import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DashboardLayout} from "../layouts/DashboardLayout";

interface LeaderboardEntry {
    username: string;
    score: number;
}

export const TournamentLeaderboard = () => {
    const {tournamentId} = useParams();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !tournamentId) return;

        fetch(`http://localhost:8080/api/tournaments/${tournamentId}/leaderboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Błąd pobierania wyników");
                return res.json();
            })
            .then(setEntries)
            .catch(err => {
                console.error("Leaderboard error:", err);
                setError("Nie udało się pobrać wyników turnieju.");
            });
    }, [tournamentId]);

    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">Wyniki turnieju #{tournamentId}</h2>
                {error ? (
                    <p style={{color: "red"}}>{error}</p>
                ) : entries.length === 0 ? (
                    <p>Brak wyników dla tego turnieju.</p>
                ) : (
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        overflow: "hidden"
                    }}>
                        <thead style={{backgroundColor: "#f0f0f0"}}>
                        <tr>
                            <th style={{padding: "0.5rem", border: "1px solid #ccc"}}>Miejsce</th>
                            <th style={{padding: "0.5rem", border: "1px solid #ccc"}}>Użytkownik</th>
                            <th style={{padding: "0.5rem", border: "1px solid #ccc"}}>Wynik</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((entry, i) => (
                            <tr key={i}>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>{i + 1}</td>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>{entry.username}</td>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>{entry.score}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};
