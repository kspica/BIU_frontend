import {useQuizPlay} from "../context/QuizPlayContext";

export const QuizProgress = () => {
    const {quiz, currentIndex, score} = useQuizPlay();

    if (!quiz) return null;

    const progress = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);

    return (
        <div className="quiz-progress">
            <p>Postęp: {progress}% ({currentIndex + 1} / {quiz.questions.length})</p>
            <p>Wynik: {score}</p>
            <progress value={progress} max={100}/>
        </div>
    );
};
