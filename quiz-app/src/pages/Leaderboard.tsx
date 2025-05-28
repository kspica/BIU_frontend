import {useEffect, useState} from "react";
import {useAuth} from "../auth/AuthContext";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {DashboardLayout} from "../layouts/DashboardLayout";

interface Quiz {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
}

export const Leaderboard = () => {
    const {token} = useAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetch = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/quizzes", {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
                <h2 className="form-title">Najlepsze wyniki – wybierz quiz</h2>
                {quizzes.length === 0 ? (
                    <p>Brak dostępnych quizów.</p>
                ) : (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {quizzes.map((q) => (
                            <li
                                key={q.id}
                                style={{
                                    marginBottom: "0.5rem",
                                    padding: "0.5rem",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px"
                                }}
                            >
                                <div
                                    style={{ cursor: "pointer" }}
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
