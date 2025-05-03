import { createContext, useContext, useState, ReactNode } from "react";

export type QuestionType = "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "OPEN";

export interface Question {
    type: QuestionType;
    content: string;
    options: string[];
    correctAnswers: string[];
}

export interface QuizData {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    coverImageUrl: string;
    timeLimit: number;
    questions: Question[];
}

const defaultQuizData: QuizData = {
    title: "",
    description: "",
    category: "",
    difficulty: "",
    coverImageUrl: "",
    timeLimit: 0,
    questions: [],
};

const QuizContext = createContext<{
    quiz: QuizData;
    setQuiz: (data: QuizData) => void;
}>({
    quiz: defaultQuizData,
    setQuiz: () => {},
});

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
    const [quiz, setQuiz] = useState<QuizData>(defaultQuizData);

    return (
        <QuizContext.Provider value={{ quiz, setQuiz }}>
            {children}
        </QuizContext.Provider>
    );
};
