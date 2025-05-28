import {useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {useQuizPlay, QuizPlayProvider} from "../context/QuizPlayContext";
import {QuestionDisplay} from "../components/QuestionDisplay";
import {QuizProgress} from "../components/QuizProgress";
import {useAuth} from "../auth/AuthContext";
import "../styles/question-builder.scss";



const QuizPlayInner = () => {
    const {quizId} = useParams();
    const {token} = useAuth();
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
                const res = await axios.get(`http://localhost:8080/api/quizzes/${quizId}`, {
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
                await axios.post("http://localhost:8080/api/results", {
                    quizId: quiz.id,
                    score,
                    timeTakenSeconds: quiz.timeLimit * 60 - timeLeft
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
    }, [isFinished, quiz, score, timeLeft, token]);

    if (!quiz) {
        return (
            <DashboardLayout>
                <p>Ładowanie quizu...</p>
            </DashboardLayout>
        );
    }

    if (isFinished) {
        return (
            <DashboardLayout>
                <div className="form-container">
                    <h2>Quiz zakończony!</h2>
                    <p>Twój wynik: {score} / {quiz.questions.length}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="form-container">
                <QuizProgress/>
                {currentQuestion && <QuestionDisplay question={currentQuestion}/>}
                {feedback && <p className="feedback">{feedback}</p>}
                <div className="quiz-timer">
                    <span className="quiz-timer-icon">⏱️</span>
                    <span className="quiz-timer-label">Pozostały czas:</span>
                    <span className="quiz-timer-time">
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
    </span>
                </div>

                <div className="controls">
                    <button className="form-button" onClick={submitAnswer}>Zatwierdź odpowiedź</button>
                    {feedback && <button className="form-button" onClick={nextQuestion}>Dalej</button>}
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
