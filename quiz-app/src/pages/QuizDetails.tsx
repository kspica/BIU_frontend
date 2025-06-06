import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import axios from "axios";
import {QuestionForm, QuestionFormData} from "./QuestionForm";
import {API_URL} from "../api/config";

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

export const QuizDetails = () => {
    const navigate = useNavigate();
    const {quizId} = useParams();
    const {token} = useAuth();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");

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
                <div className="form-container"><p>Ładowanie quizu...</p></div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">{quiz.title}</h2>

                {isEditing ? (
                    <>
                        <label>
                            Opis: {" "}
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                      className="form-input"/>
                        </label>
                        <label>
                            Kategoria: {" "}
                            <input value={category} onChange={(e) => setCategory(e.target.value)}
                                   className="form-input"/>
                        </label>
                        <label>
                            Poziom trudności: {" "}
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                                    className="form-input">
                                <option value="">Wybierz</option>
                                <option value="Łatwy">Łatwy</option>
                                <option value="Średni">Średni</option>
                                <option value="Trudny">Trudny</option>
                            </select>
                        </label>
                        <button onClick={handleSave} className="form-button">Zapisz zmiany</button>

                        <h3>Dodaj nowe pytanie</h3>
                        <QuestionForm onSubmit={handleAddQuestion}/>
                    </>
                ) : (
                    <>
                        <p><strong>Kategoria:</strong> {quiz.category}</p>
                        <p><strong>Poziom trudności:</strong> {quiz.difficulty}</p>
                        <p><strong>Opis:</strong> {quiz.description}</p>
                        <button onClick={() => setIsEditing(true)} className="form-button">Edytuj</button>
                    </>
                )}

                <h3>Pytania</h3>
                {quiz.questions.map((q, index) => (
                    <div key={index} className="question-item">
                        <p><strong>{index + 1}. {q.content}</strong></p>
                        {q.options && q.options.length > 0 && (
                            <ul>
                                {q.options.map((opt, i) => (
                                    <li key={i}>
                                        {opt} {q.correctAnswers.includes(opt) ? "(✅ poprawna)" : ""}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {q.type === "OPEN" && <p><em>Odpowiedź otwarta</em></p>}
                        <button onClick={() => handleDeleteQuestion(q.id!)} className="delete-button">Usuń pytanie
                        </button>
                    </div>
                ))}
            </div>
            <button className="form-button" onClick={() => navigate("/my-quizzes")}>← Wróć do moich quizów</button>
        </DashboardLayout>
    );
};
