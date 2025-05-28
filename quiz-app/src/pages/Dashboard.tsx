import {DashboardLayout} from "../layouts/DashboardLayout";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";

interface Quiz {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
}

export const Dashboard = () => {
    const {token} = useAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/quizzes/user", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuizzes(res.data);
            } catch (err) {
                console.error("Błąd pobierania quizów:", err);
            }
        };

        fetchQuizzes();
    }, [token]);

    const handleStart = (quizId: number) => {
        navigate(`/play/${quizId}`);
    };

    return (
        <DashboardLayout>
            <h1>Moje quizy</h1>
            {quizzes.length === 0 ? (
                <p>Brak quizów do rozwiązania.</p>
            ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {quizzes.map((quiz) => (
                        <li key={quiz.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }}>
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <p><strong>Kategoria:</strong> {quiz.category} | <strong>Trudność:</strong> {quiz.difficulty}</p>
                            <button onClick={() => handleStart(quiz.id)} className="form-button">Rozpocznij</button>
                        </li>
                    ))}
                </ul>
            )}
        </DashboardLayout>
    );
};
