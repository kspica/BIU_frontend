import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {DashboardLayout} from "../layouts/DashboardLayout";
import "../styles/forms.scss";
import {useQuiz} from "../context/QuizContext";
import {useTranslation} from "react-i18next";

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
    const { t } = useTranslation();

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
                <h2>{t('builder.title')}</h2>
                <input {...register("title")} placeholder={t('builder.title')} required/>
                <textarea {...register("description")} placeholder="Opis" required/>
                <select {...register("category")} required>
                    <option value="">{t('builder.categoryPlaceholder')}</option>
                    <option value="Informatyka">Informatyka</option>
                    <option value="Matematyka">Matematyka</option>
                </select>
                <select {...register("difficulty")} required>
                    <option value="">{t('builder.difficultyPlaceholder')}</option>
                    <option value="Łatwy">{t('builder.difficultyEasy')}</option>
                    <option value="Średni">{t('builder.difficultyMedium')}</option>
                    <option value="Trudny">{t('builder.difficultyHard')}</option>
                </select>
                <input type="text" {...register("coverImageUrl")} placeholder={t('builder.coverUrl')}/>
                <input type="number" {...register("timeLimit")} placeholder={t('builder.timeLimit')} required/>
                <button type="submit">{t('builder.next')}</button>
            </form>
            <button onClick={loadMockQuiz} className="form-button">{t('builder.mock')}</button>
        </DashboardLayout>
    );
};
