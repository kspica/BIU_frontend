import {useQuizPlay} from "../context/QuizPlayContext";
import {useTranslation} from "react-i18next";

export const QuizProgress = () => {
    const {quiz, currentIndex, score} = useQuizPlay();
    const { t } = useTranslation();

    if (!quiz) return null;

    const progress = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);

    return (
        <div className="quiz-progress">
            <p>{t('progress.progress')} {progress}% ({currentIndex + 1} / {quiz.questions.length})</p>
            <p>{t('progress.score')} {score}</p>
            <progress value={progress} max={100}/>
        </div>
    );
};
