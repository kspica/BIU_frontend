import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../auth/AuthContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import "../styles/forms.scss";

interface Quiz {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    timeLimit: number;
}

export const QuizSearch = () => {
    const {token} = useAuth();
    const [filters, setFilters] = useState({ title: "", category: "", difficulty: "", timeLimit: "" });
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const fetchQuizzes = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/quizzes/search", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    title: filters.title || undefined,
                    category: filters.category || undefined,
                    difficulty: filters.difficulty || undefined,
                    timeLimit: filters.timeLimit || undefined
                }
            });
            setQuizzes(res.data);
        } catch (err) {
            console.error("Błąd pobierania quizów:", err);
        }
    }, [token, filters]);

    useEffect(() => {
        if (token) fetchQuizzes();
    }, [token, fetchQuizzes]);


    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">Wyszukiwarka quizów</h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.5rem"
                }}>
                    <input type="text" name="title" placeholder="Tytuł" value={filters.title} onChange={handleChange}/>
                    <input type="text" name="category" placeholder="Kategoria" value={filters.category}
                           onChange={handleChange}/>
                    <select name="difficulty" value={filters.difficulty} onChange={handleChange}>
                        <option value="">Poziom</option>
                        <option>Łatwy</option>
                        <option>Średni</option>
                        <option>Trudny</option>
                    </select>
                    <input type="number" name="timeLimit" placeholder="Czas [min]" value={filters.timeLimit}
                           onChange={handleChange}/>
                </div>
                <div style={{textAlign: "center", marginBottom: "1.5rem"}}>
                    <button
                        className="form-button"
                        onClick={() => setFilters({title: "", category: "", difficulty: "", timeLimit: ""})}
                    >Wyczyść filtry</button>
                </div>


                {quizzes.length === 0 ? (
                    <p>Brak quizów spełniających kryteria.</p>
                ) : (
                    <ul style={{listStyleType: "none", padding: 0}}>
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
                                <strong>{q.title}</strong> — {q.category} ({q.difficulty}) — {q.timeLimit} min
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DashboardLayout>
    );
};
