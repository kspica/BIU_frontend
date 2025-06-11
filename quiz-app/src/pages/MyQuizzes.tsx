import {useCallback, useEffect, useState} from "react";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import api from "../api/axiosInterceptor";

interface Quiz {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
}

export const MyQuizzes = () => {
    const {t} = useTranslation();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();

    const fetchQuizzes = useCallback(async () => {
        try {
            const res = await api.get("/quizzes/user");
            if (Array.isArray(res.data)) {
                setQuizzes(res.data);
            } else {
                console.warn("Nieprawidłowa odpowiedź z backendu:", res.data);
                setQuizzes([]);
            }
        } catch (error) {
            console.error("Błąd podczas pobierania quizów", error);
        }
    }, []);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleClick = (quizId: number) => {
        navigate(`/my-quizzes/${quizId}`);
    };

    const handleDelete = async (quizId: number) => {
        if (!window.confirm(t('myquizzes.deleteConfirm'))) return;
        try {
            await api.delete(`/quizzes/${quizId}`);
            setQuizzes(prev => prev.filter(q => q.id !== quizId));
        } catch (error) {
            console.error("Błąd podczas usuwania quizu:", error);
            alert(t('myquizzes.deleteError', 'Wystąpił błąd przy usuwaniu quizu'));
        }
    };

    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">{t('myquizzes.title')}</h2>
                {quizzes.length === 0 ? (
                    <p>{t('myquizzes.none')}</p>
                ) : (
                    <ul className="list-reset">
                        {quizzes.map((quiz) => (
                            <li key={quiz.id} className="list-item">
                                <div className="my-quiz-item">
                                    <div className="clickable" onClick={() => handleClick(quiz.id)}>
                                        <strong>{quiz.title}</strong> — {quiz.category} ({quiz.difficulty})
                                    </div>
                                    <button className="delete-button margin-left-1"
                                            onClick={() => handleDelete(quiz.id)}>
                                        {t('myquizzes.delete')}
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
