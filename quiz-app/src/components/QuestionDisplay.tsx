import {useQuizPlay, UserAnswer} from "../context/QuizPlayContext";

interface Props {
    question: {
        id: number;
        content: string;
        type: string;
        options: string[];
    };
}

export const QuestionDisplay = ({question}: Props) => {
    const {selectedAnswer, selectAnswer} = useQuizPlay();

    const toggleOption = (option: string) => {
        let updated: UserAnswer = [];
        if (question.type === "SINGLE") {
            updated = [option];
        } else {
            if (selectedAnswer.includes(option)) {
                updated = selectedAnswer.filter(o => o !== option);
            } else {
                updated = [...selectedAnswer, option];
            }
        }
        selectAnswer(updated);
    };

    return (
        <div className="question-display">
            <h3>{question.content}</h3>
            {question.options.map(opt => (
                <div key={opt}>
                    <label>
                        <input
                            type={question.type === "SINGLE" ? "radio" : "checkbox"}
                            checked={selectedAnswer.includes(opt)}
                            onChange={() => toggleOption(opt)}
                        />
                        {opt}
                    </label>
                </div>
            ))}
        </div>
    );
};
