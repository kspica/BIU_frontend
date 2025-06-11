import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import "../styles/forms.scss";
import {useTranslation} from "react-i18next";
import api from "../api/axiosInterceptor";

interface Quiz {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    timeLimit: number;
}

export const QuizSearch = () => {
    const {token} = useAuth();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [filters, setFilters] = useState({title: "", category: "", difficulty: "", timeLimit: ""});
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({...filters, [e.target.name]: e.target.value});
    };

    const fetchQuizzes = useCallback(async () => {
        try {
            const res = await api.get("/quizzes/search", {
                params: {
                    title: filters.title || undefined,
                    category: filters.category || undefined,
                    difficulty: filters.difficulty || undefined,
                    timeLimit: filters.timeLimit || undefined,
                },
            });
            setQuizzes(res.data);
        } catch (err) {
            console.error("Błąd pobierania quizów:", err);
        }
    }, [filters]);

    useEffect(() => {
        if (token) fetchQuizzes();
    }, [token, fetchQuizzes]);


    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">{t('quizSearch.title')}</h2>
                <div className="filters-grid">
                    <input type="text" name="title" placeholder={t('quizSearch.titlePlaceholder')} value={filters.title}
                           onChange={handleChange}/>
                    <input type="text" name="category" placeholder={t('quizSearch.categoryPlaceholder')}
                           value={filters.category}
                           onChange={handleChange}/>
                    <select name="difficulty" value={filters.difficulty} onChange={handleChange}>
                        <option value="">{t('quizSearch.difficulty')}</option>
                        <option>Łatwy</option>
                        <option>Średni</option>
                        <option>Trudny</option>
                    </select>
                    <input type="number" name="timeLimit" placeholder="Czas [min]" value={filters.timeLimit}
                           onChange={handleChange}/>
                </div>
                <div className="centered-section">
                    <button
                        className="form-button"
                        onClick={() => setFilters({title: "", category: "", difficulty: "", timeLimit: ""})}
                    >{t('quizSearch.clear')}
                    </button>
                </div>


                {quizzes.length === 0 ? (
                    <p>{t('quizSearch.none')}</p>
                ) : (
                    <ul className="list-reset">
                        {quizzes.map((q) => (
                            <li key={q.id} className="list-item clickable"
                                onClick={() => navigate(`/quiz-search/${q.id}`)}>
                                <strong>{q.title}</strong> — {q.category} ({q.difficulty}) — {q.timeLimit} min
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DashboardLayout>
    );
};
