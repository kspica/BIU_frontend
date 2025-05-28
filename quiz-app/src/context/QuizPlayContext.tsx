import React, {createContext, useContext, useState, useEffect} from "react";

export type UserAnswer = string[];

interface Question {
    id: number;
    content: string;
    type: string;
    options: string[];
    correctAnswers: string[];
}

interface Quiz {
    id: number;
    title: string;
    questions: Question[];
    timeLimit: number; // w minutach
}

interface QuizPlayContextType {
    quiz: Quiz | null;
    currentIndex: number;
    currentQuestion: Question | null;
    selectedAnswer: UserAnswer;
    score: number;
    timeLeft: number;
    isFinished: boolean;
    feedback: string | null;
    setQuiz: (quiz: Quiz) => void;
    selectAnswer: (ans: UserAnswer) => void;
    submitAnswer: () => void;
    nextQuestion: () => void;
    restart: () => void;
}

const QuizPlayContext = createContext<QuizPlayContextType | undefined>(undefined);

export const useQuizPlay = () => {
    const ctx = useContext(QuizPlayContext);
    if (!ctx) throw new Error("useQuizPlay must be used within QuizPlayProvider");
    return ctx;
};

export const QuizPlayProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<UserAnswer>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const currentQuestion = quiz?.questions[currentIndex] ?? null;

    useEffect(() => {
        if (!quiz || isFinished) return;

        const totalSeconds = quiz.timeLimit * 60;
        setTimeLeft(totalSeconds);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz, isFinished]);

    const selectAnswer = (ans: UserAnswer) => {
        setSelectedAnswer(ans);
    };

    const submitAnswer = () => {
        if (!currentQuestion) return;
        const correct = currentQuestion.correctAnswers.sort().join(",") === selectedAnswer.sort().join(",");
        if (correct) {
            setScore(prev => prev + 1);
            setFeedback("✅ Dobra odpowiedź!");
        } else {
            setFeedback("❌ Zła odpowiedź");
        }
    };

    const nextQuestion = () => {
        setSelectedAnswer([]);
        setFeedback(null);
        if (quiz && currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const restart = () => {
        setCurrentIndex(0);
        setSelectedAnswer([]);
        setScore(0);
        setIsFinished(false);
        setFeedback(null);
    };

    return (
        <QuizPlayContext.Provider value={{
            quiz,
            currentIndex,
            currentQuestion,
            selectedAnswer,
            score,
            timeLeft,
            isFinished,
            feedback,
            setQuiz,
            selectAnswer,
            submitAnswer,
            nextQuestion,
            restart
        }}>
            {children}
        </QuizPlayContext.Provider>
    );
};
