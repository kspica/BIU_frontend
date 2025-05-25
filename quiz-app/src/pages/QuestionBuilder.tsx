import {useFieldArray, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {QuestionType, useQuiz} from "../context/QuizContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {createQuiz} from "../api/quizApi";
import {useState} from "react";
import "../styles/question-builder.scss";
import {QuestionForm} from "./QuestionForm";


type QuestionFormData = {
    content: string;
    type: "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "OPEN";
    options: { value: string }[];
    correctAnswers: string[];
};

export const QuestionBuilder = () => {
    const {quiz, setQuiz} = useQuiz();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
//DO TESTOW
    const MOCK_QUESTIONS = [
        {
            content: "Jaka jest stolica Polski?",
            type: "SINGLE" as QuestionType,
            options: ["Warszawa", "Kraków", "Gdańsk"],
            correctAnswers: ["Warszawa"]
        },
        {
            content: "Wybierz liczby pierwsze",
            type: "MULTIPLE" as QuestionType,
            options: ["2", "3", "4", "5"],
            correctAnswers: ["2", "3", "5"]
        }
    ];

    const loadMockQuestions = () => {
        setQuiz({ ...quiz, questions: [...quiz.questions, ...MOCK_QUESTIONS] });
    };

    const {register, handleSubmit, watch, control, reset} = useForm<QuestionFormData>({
        defaultValues: {
            type: "SINGLE",
            options: [{value: ""}, {value: ""}],
            correctAnswers: [],
        },
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "options",
    });

    const type = watch("type");

    const onAddQuestion = (data: QuestionFormData) => {
        const formatted = {
            type: data.type,
            content: data.content,
            options: data.options.map((o) => o.value),
            correctAnswers: data.correctAnswers,
        };

        setQuiz({...quiz, questions: [...quiz.questions, formatted]});
        reset({content: "", type: data.type, options: [{value: ""}, {value: ""}], correctAnswers: []});
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createQuiz(quiz);
            navigate("/my-quizzes");
        } catch (err) {
            console.error("Błąd podczas zapisu quizu:", err);
            alert("Wystąpił błąd przy zapisie quizu");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">Dodaj pytanie</h2>

                <QuestionForm onSubmit={(data) => {
                    const formatted = {
                        type: data.type,
                        content: data.content,
                        options: data.options.map((o) => o.value),
                        correctAnswers: data.correctAnswers,
                    };
                    setQuiz({...quiz, questions: [...quiz.questions, formatted]});
                }} />

                <div className="question-preview">
                    <h3>Dodane pytania:</h3>
                    <ul>
                        {quiz.questions.map((q, index) => (
                            <li key={index}><strong>{index + 1}.</strong> {q.content}</li>
                        ))}
                    </ul>
                </div>
                <button onClick={onSubmit} className="form-button"
                        disabled={isSubmitting}> {isSubmitting ? "Zapisywanie..." : "Zakończ i zapisz quiz"}</button>
                <button onClick={() => navigate("/quiz-builder")} className="form-button">Wstecz</button>
                <button onClick={loadMockQuestions} className="form-button">Załaduj pytania testowe</button>

            </div>
        </DashboardLayout>
    );
};
