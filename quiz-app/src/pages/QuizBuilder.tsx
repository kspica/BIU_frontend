import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {DashboardLayout} from "../layouts/DashboardLayout";
import "../styles/forms.scss";
import {useQuiz} from "../context/QuizContext";

const MOCK_QUIZ = {
    title: "Testowy quiz z wiedzy ogólnej",
    description: "Quiz zawiera pytania z różnych dziedzin wiedzy.",
    category: "Informatyka",
    difficulty: "Średni",
    coverImageUrl: "https://example.com/quiz.jpg",
    timeLimit: 10
};

export const QuizBuilder = () => {
    const {register, handleSubmit, setValue} = useForm();
    const navigate = useNavigate();
    const {quiz, setQuiz} = useQuiz();

    const loadMockQuiz = () => {
        setQuiz({...quiz, ...MOCK_QUIZ});
        Object.entries(MOCK_QUIZ).forEach(([key, value]) => setValue(key as any, value));
    };



    const onSubmit = (data: any) => {
        setQuiz({...quiz, ...data});
        navigate("/quiz-builder/questions");
    };

    return (
        <DashboardLayout>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Stwórz nowy quiz</h2>
                <input {...register("title")} placeholder="Tytuł" required/>
                <textarea {...register("description")} placeholder="Opis" required/>
                <select {...register("category")} required>
                    <option value="">Wybierz kategorię</option>
                    <option value="Informatyka">Informatyka</option>
                    <option value="Matematyka">Matematyka</option>
                </select>
                <select {...register("difficulty")} required>
                    <option value="">Poziom trudności</option>
                    <option value="Łatwy">Łatwy</option>
                    <option value="Średni">Średni</option>
                    <option value="Trudny">Trudny</option>
                </select>
                <input type="text" {...register("coverImageUrl")} placeholder="URL obrazka"/>
                <input type="number" {...register("timeLimit")} placeholder="Limit czasowy (min)" required/>
                <button type="submit">Dalej</button>
            </form>
            <button onClick={loadMockQuiz} className="form-button">Załaduj dane testowe</button>
        </DashboardLayout>
    );
};
