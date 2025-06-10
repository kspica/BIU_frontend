import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import axios from "axios";
import {QuestionForm, QuestionFormData} from "./QuestionForm";
import {API_URL} from "../api/config";
import {useTranslation} from "react-i18next";

interface Question {
    id?: number;
    content: string;
    type: string;
    options: string[];
    correctAnswers: string[];
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    questions: Question[];
}

interface QuizDetailsProps {
    readOnly?: boolean;
}

export const QuizDetails = ({readOnly = false}: QuizDetailsProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const {quizId} = useParams();
    const {token} = useAuth();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const isFromSearch = location.pathname.startsWith("/quiz-search/");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`${API_URL}/quizzes/${quizId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setQuiz(res.data);
                setDescription(res.data.description);
                setCategory(res.data.category);
                setDifficulty(res.data.difficulty);
            } catch (error) {
                console.error("Błąd podczas pobierania szczegółów quizu", error);
            }
        };

        fetchQuiz();
    }, [quizId, token]);

    const handleSave = async () => {
        try {
            const updated = {...quiz, description, category, difficulty};
            await axios.put(`${API_URL}/quizzes/${quizId}`, updated, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setQuiz(updated as Quiz);
            setIsEditing(false);
        } catch (e) {
            alert("Błąd podczas zapisu zmian");
            console.error(e);
        }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        if (!quiz) return;
        const updated = {
            ...quiz,
            questions: quiz.questions.filter((q) => q.id !== questionId),
        };
        try {
            await axios.put(`${API_URL}/quizzes/${quiz.id}`, updated, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setQuiz(updated);
        } catch (e) {
            alert("Błąd podczas usuwania pytania");
            console.error(e);
        }
    };

    const handleAddQuestion = async (data: QuestionFormData) => {
        if (!quiz) return;

        const newQuestion: Question = {
            content: data.content,
            type: data.type,
            options: data.options.map((o) => o.value),
            correctAnswers: data.correctAnswers,
        };

        const updated = {
            ...quiz,
            questions: [...quiz.questions, newQuestion],
        };

        try {
            await axios.put(`${API_URL}/quizzes/${quiz.id}`, updated, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setQuiz(updated);
        } catch (e) {
            alert("Błąd podczas dodawania pytania");
            console.error(e);
        }
    };

    if (!quiz) {
        return (
            <DashboardLayout>
                <div className="form-container"><p>{t('quiz.loading')}</p></div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">{quiz.title}</h2>
                {readOnly ? (
                    <>
                        <p><strong>{t('quiz.category')}</strong> {quiz.category}</p>
                        <p><strong>{t('quiz.difficulty')}</strong> {quiz.difficulty}</p>
                        <p><strong>{t('quiz.description')}</strong> {quiz.description}</p>
                    </>
                ) : isEditing ? (
                    <>
                        <label>{t('quiz.description')}:
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-input"/>
                        </label>
                        <label>{t('quiz.category')}:
                            <input value={category} onChange={(e) => setCategory(e.target.value)} className="form-input"/>
                        </label>
                        <label>{t('quiz.difficulty')}:
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="form-input">
                                <option value="">{t('builder.difficultyPlaceholder')}</option>
                                <option value="Łatwy">{t('builder.difficultyEasy')}</option>
                                <option value="Średni">{t('builder.difficultyMedium')}</option>
                                <option value="Trudny">{t('builder.difficultyHard')}</option>
                            </select>
                        </label>
                        <button onClick={handleSave} className="form-button">{t('quiz.save')}</button>
                        <h3>{t('quiz.addQuestion')}</h3>
                        <QuestionForm onSubmit={handleAddQuestion}/>
                    </>
                ) : (
                    <>
                        <p><strong>{t('quiz.category')}</strong> {quiz.category}</p>
                        <p><strong>{t('quiz.difficulty')}</strong> {quiz.difficulty}</p>
                        <p><strong>{t('quiz.description')}</strong> {quiz.description}</p>
                        <button onClick={() => setIsEditing(true)} className="form-button">{t('quiz.edit')}</button>
                    </>
                )}

                <h3>{t('quiz.questions')}</h3>
                {quiz.questions.map((q, index) => (
                    <div key={index} className="question-item">
                        <p><strong>{index + 1}. {q.content}</strong></p>
                        {q.options?.length > 0 ? (
                            <ul>
                                {q.options.map((opt, i) => (
                                    <li key={i}>
                                        {opt} {q.correctAnswers.includes(opt) ? "(✅)" : ""}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            q.type === "OPEN" && <p><em>{t('quiz.openAnswer')}</em></p>
                        )}
                        {!readOnly && (
                            <button onClick={() => handleDeleteQuestion(q.id!)} className="delete-button">{t('quiz.delete')}</button>
                        )}
                    </div>
                ))}
            </div>
            <button className="form-button" onClick={() => navigate(isFromSearch ? "/quiz-search" : "/my-quizzes")}>
                ← {isFromSearch ? t('quizSearch.back') : t('myquizzes.back')}
            </button>
        </DashboardLayout>
    );
};
