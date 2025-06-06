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
                    <table className="table-layout">
                        <thead className="table-header">
                        <tr>
                            <th className="table-cell">Miejsce</th>
                            <th className="table-cell">Użytkownik</th>
                            <th className="table-cell">Wynik</th>
                            <th className="table-cell">Czas</th>
                            <th className="table-cell">Data</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((res, i) => (
                            <tr key={res.id}>
                                <td className="table-cell">{i + 1}</td>
                                <td className="table-cell">{res.user.username}</td>
                                <td className="table-cell">{res.score}</td>
                                <td className="table-cell">
                                    {Math.floor(res.timeTakenSeconds / 60)}:{String(res.timeTakenSeconds % 60).padStart(2, "0")}
                                </td>
                                <td className="table-cell">
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
