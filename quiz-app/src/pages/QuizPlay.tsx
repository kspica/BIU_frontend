import {useEffect} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {QuizPlayProvider, useQuizPlay} from "../context/QuizPlayContext";
import {QuestionDisplay} from "../components/QuestionDisplay";
import {QuizProgress} from "../components/QuizProgress";
import {useAuth} from "../auth/AuthContext";
import "../styles/question-builder.scss";
import {API_URL} from "../api/config";
import {useTranslation} from "react-i18next";


const QuizPlayInner = () => {
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("tournamentId");
    const {quizId} = useParams();
    const {token} = useAuth();
    const { t } = useTranslation();
    const {
        quiz,
        setQuiz,
        currentQuestion,
        isFinished,
        score,
        submitAnswer,
        nextQuestion,
        feedback,
        timeLeft
    } = useQuizPlay();

    // Pobierz dane quizu
    useEffect(() => {
        if (!token) return;

        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`${API_URL}/quizzes/${quizId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setQuiz(res.data);
            } catch (err) {
                console.error("Błąd pobierania quizu:", err);
            }
        };

        fetchQuiz();
    }, [quizId, token, setQuiz]);

    // Zapisz wynik quizu po zakończeniu
    useEffect(() => {
        if (!isFinished || !quiz || !token) return;

        const submitResult = async () => {
            try {
                await axios.post(`${API_URL}/results`, {
                    quizId: quiz.id,
                    score,
                    timeTakenSeconds: quiz.timeLimit * 60 - timeLeft,
                    tournamentId: tournamentId ? parseInt(tournamentId) : null
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("✅ Wynik quizu został zapisany");
            } catch (error) {
                console.error("❌ Błąd zapisu wyniku:", error);
            }
        };

        submitResult();
    }, [isFinished, quiz, score, timeLeft, token, tournamentId]);

    if (!quiz) {
        return (
            <DashboardLayout>
                <p>{t('quizPlay.loading')}</p>
            </DashboardLayout>
        );
    }

    if (isFinished) {
        return (
            <DashboardLayout>
                <div className="form-container">
                    <h2>{t('quizPlay.finished')}</h2>
                    <p>{t('quizPlay.score')}: {score} / {quiz.questions.length}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="form-container">
                <QuizProgress/>
                {currentQuestion && <QuestionDisplay question={currentQuestion}/>}
                <p className="feedback">{feedback ?? "\u00A0"}</p>
                <div className="quiz-timer">
                    <span className="quiz-timer-icon">⏱️</span>
                    <span className="quiz-timer-label">{t('quizPlay.timeLeft')}</span>
                    <span className="quiz-timer-time">
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
    </span>
                </div>

                <div className="controls">
                    <button className="form-button" onClick={submitAnswer}>{t('quizPlay.confirm')}</button>
                    {feedback && <button className="form-button" onClick={nextQuestion}>{t('quizPlay.next')}</button>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export const QuizPlay = () => (
    <QuizPlayProvider>
        <QuizPlayInner/>
    </QuizPlayProvider>
);
