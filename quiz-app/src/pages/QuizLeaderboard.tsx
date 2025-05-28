import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useAuth} from "../auth/AuthContext";
import {DashboardLayout} from "../layouts/DashboardLayout";

interface QuizResult {
    id: number;
    score: number;
    timeTakenSeconds: number;
    completedAt: string;
    user: { username: string };
}

export const QuizLeaderboard = () => {
    const {quizId} = useParams();
    const {token} = useAuth();
    const [results, setResults] = useState<QuizResult[]>([]);

    useEffect(() => {
        if (!token || !quizId) return;

        const fetch = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/results/top10/${quizId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (e) {
                console.error("Błąd pobierania wyników:", e);
            }
        };

        fetch();
    }, [quizId, token]);

    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">Najlepsze wyniki</h2>
                {results.length === 0 ? (
                    <p>Brak wyników dla tego quizu.</p>
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
                            <th style={{padding: "0.5rem", border: "1px solid #ccc"}}>Czas</th>
                            <th style={{padding: "0.5rem", border: "1px solid #ccc"}}>Data</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((res, i) => (
                            <tr key={res.id}>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>{i + 1}</td>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>{res.user.username}</td>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>{res.score}</td>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>
                                    {Math.floor(res.timeTakenSeconds / 60)}:{String(res.timeTakenSeconds % 60).padStart(2, "0")}
                                </td>
                                <td style={{padding: "0.5rem", border: "1px solid #ccc"}}>
                                    {new Date(res.completedAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};
