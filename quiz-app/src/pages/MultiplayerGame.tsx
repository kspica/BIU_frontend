import {useEffect, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {DashboardLayout} from "../layouts/DashboardLayout";

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
}

const mockQuestions: Question[] = [
    {
        id: 1,
        text: "Stolica Francji?",
        options: ["Paryż", "Berlin", "Rzym", "Madryt"],
        correctAnswer: "Paryż"
    },
    {
        id: 2,
        text: "Wynik 2 + 2?",
        options: ["3", "4", "5", "22"],
        correctAnswer: "4"
    }
];

export const MultiplayerGame = () => {
    const {quizId} = useParams();
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get("roomId");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [playerId: string]: string }>({});
    const [scores, setScores] = useState<{ [playerId: string]: number }>({
        player1: 0,
        player2: 0
    });

    const currentQuestion = mockQuestions[currentIndex];

    const handleAnswer = (playerId: string, selected: string) => {
        setAnswers(prev => ({...prev, [playerId]: selected}));
    };

    useEffect(() => {
        if (answers["player1"] && answers["player2"]) {
            const correct = currentQuestion.correctAnswer;
            const updatedScores = {...scores};

            if (answers["player1"] === correct) updatedScores["player1"] += 1;
            if (answers["player2"] === correct) updatedScores["player2"] += 1;

            setTimeout(() => {
                setScores(updatedScores);
                setAnswers({});
                setCurrentIndex(prev => prev + 1);
            }, 1500);
        }
    }, [answers]);

    return (
        <DashboardLayout>
            <div className="multiplayer-container">
                {currentIndex >= mockQuestions.length ? (
                    <>
                        <h2>🎉 Wyniki końcowe</h2>
                        <p><strong>Gracz 1:</strong> {scores["player1"]} pkt</p>
                        <p><strong>Gracz 2:</strong> {scores["player2"]} pkt</p>
                        <p><strong>Zwycięzca:</strong> {
                            scores["player1"] > scores["player2"] ? "Gracz 1" :
                                scores["player2"] > scores["player1"] ? "Gracz 2" : "Remis"
                        }</p>
                    </>
                ) : (
                    <>
                        <h2>🧠 Pytanie {currentIndex + 1} z {mockQuestions.length}</h2>
                        <p className="question-text"><strong>{currentQuestion.text}</strong></p>

                        <div className="answers-container">
                            <div>
                                <h3>Gracz 1</h3>
                                {currentQuestion.options.map(option => (
                                    <button
                                        key={option}
                                        disabled={answers["player1"] !== undefined}
                                        onClick={() => handleAnswer("player1", option)}
                                        className="form-button margin-button"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <div>
                                <h3>Gracz 2</h3>
                                {currentQuestion.options.map(option => (
                                    <button
                                        key={option}
                                        disabled={answers["player2"] !== undefined}
                                        onClick={() => handleAnswer("player2", option)}
                                        className="form-button margin-button"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};
