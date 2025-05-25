import { useEffect, useState, useCallback } from "react";
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

    const fetchQuizzes = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/quizzes/user", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data)) {
                setQuizzes(res.data);
            } else {
                console.warn("Nieprawidłowa odpowiedź z backendu:", res.data);
                setQuizzes([]);
            }
        } catch (error) {
            console.error("Błąd podczas pobierania quizów", error);
        }
    }, [token]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleClick = (quizId: number) => {
        navigate(`/my-quizzes/${quizId}`);
    };

    const handleDelete = async (quizId: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten quiz?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/quizzes/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setQuizzes(prev => prev.filter(q => q.id !== quizId));
        } catch (error) {
            console.error("Błąd podczas usuwania quizu:", error);
            alert("Wystąpił błąd przy usuwaniu quizu");
        }
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
                                style={{ marginBottom: "0.5rem", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ cursor: "pointer" }} onClick={() => handleClick(quiz.id)}>
                                        <strong>{quiz.title}</strong> — {quiz.category} ({quiz.difficulty})
                                    </div>
                                    <button className="delete-button" onClick={() => handleDelete(quiz.id)} style={{ marginLeft: "1rem" }}>
                                        Usuń
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DashboardLayout>
    );
};
