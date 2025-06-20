import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {useTranslation} from "react-i18next";
import api from "../api/axiosInterceptor";

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
    const {t} = useTranslation();
    const [results, setResults] = useState<QuizResult[]>([]);

    useEffect(() => {
        if (!token || !quizId) return;

        const fetch = async () => {
            try {
                const res = await api.get(`/results/top10/${quizId}`);
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
                <h2 className="form-title">{t('quizLeaderboard.title')}</h2>
                {results.length === 0 ? (
                    <p>{t('quizLeaderboard.none')}</p>
                ) : (
                    <table className="table-layout">
                        <thead className="table-header">
                        <tr>
                            <th className="table-cell">{t('quizLeaderboard.place')}</th>
                            <th className="table-cell">{t('quizLeaderboard.user')}</th>
                            <th className="table-cell">{t('quizLeaderboard.score')}</th>
                            <th className="table-cell">{t('quizLeaderboard.time')}</th>
                            <th className="table-cell">{t('quizLeaderboard.date')}</th>
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
