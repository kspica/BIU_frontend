import {useEffect, useState} from "react";
import {useAuth} from "../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {useTranslation} from "react-i18next";
import api from "../api/axiosInterceptor";

interface Quiz {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
}

export const Leaderboard = () => {
    const {token} = useAuth();
    const {t} = useTranslation();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetch = async () => {
            try {
                const res = await api.get("/quizzes");
                setQuizzes(res.data);
            } catch (err) {
                console.error("Błąd pobierania quizów:", err);
            }
        };

        fetch();
    }, [token]);

    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">{t('leaderboard.title')}</h2>
                {quizzes.length === 0 ? (
                    <p>{t('leaderboard.none')}</p>
                ) : (
                    <ul className="list-reset">
                        {quizzes.map((q) => (
                            <li className="list-item">
                                <div
                                    className="clickable"
                                    onClick={() => navigate(`/leaderboard/${q.id}`)}
                                >
                                    <strong>{q.title}</strong> — {q.category} ({q.difficulty})
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DashboardLayout>
    );
};
