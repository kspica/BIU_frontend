import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Quiz {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
}

export const MyQuizzes = () => {
    const { token } = useAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/quizzes/user", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Odpowiedź z backendu:", res.data);
                if (Array.isArray(res.data)) {
                    setQuizzes(res.data);
                } else {
                    console.warn("Nieprawidłowa odpowiedź z backendu:", res.data);
                    setQuizzes([]);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania quizów", error);
            }
        };

        fetchQuizzes();
    }, [token]);

    const handleClick = (quizId: number) => {
        navigate(`/my-quizzes/${quizId}`);
    };

    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">Moje quizy</h2>
                {quizzes.length === 0 ? (
                    <p>Brak zapisanych quizów.</p>
                ) : (
                    <ul style={{ listStyleType: "none" }}>
                        {quizzes.map((quiz) => (
                            <li
                                key={quiz.id}
                                style={{ cursor: "pointer", marginBottom: "0.5rem", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px"}}
                                onClick={() => handleClick(quiz.id)}
                            >
                                <strong>{quiz.title}</strong> — {quiz.category} ({quiz.difficulty})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DashboardLayout>
    );
};
