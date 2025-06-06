import {DashboardLayout} from "../layouts/DashboardLayout";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import { API_URL } from "../api/config";

interface Quiz {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
}

export const Dashboard = () => {
    const {token} = useAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");


    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(`${API_URL}/quizzes/user`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setQuizzes(res.data);
            } catch (err) {
                console.error("Błąd pobierania quizów:", err);
            }
        };

        fetchQuizzes();
    }, [token]);

    const handleStart = (quizId: number) => {
        navigate(`/play/${quizId}`);
    };

    const handleChallenge = (quizId: number) => {
        navigate(`/multiplayer/${quizId}`);
    };

    const openTournamentModal = (quizId: number) => {
        setSelectedQuizId(quizId);
        setShowModal(true);
    };

    const createTournament = async () => {
        if (!selectedQuizId || !startTime || !endTime) return;
        try {
            await axios.post(`${API_URL}/tournaments`, {
                quizId: selectedQuizId,
                startTime,
                endTime
            }, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setShowModal(false);
            alert("Turniej utworzony!");
        } catch (err) {
            console.error("Błąd tworzenia turnieju:", err);
        }
    };


    return (
        <DashboardLayout>
            <h1>Moje quizy</h1>
            {quizzes.length === 0 ? (
                <p>Brak quizów do rozwiązania.</p>
            ) : (
                <ul className="list-reset">
                    {quizzes.map((quiz) => (
                        <li key={quiz.id} className="list-item-lg">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <p>
                                <strong>Kategoria:</strong> {quiz.category} | <strong>Trudność:</strong> {quiz.difficulty}
                            </p>
                            <div className="button-column">
                                <button onClick={() => handleStart(quiz.id)} className="form-button">Rozpocznij</button>
                                <button onClick={() => handleChallenge(quiz.id)} className="form-button">Rywalizuj
                                </button>
                                <button onClick={() => openTournamentModal(quiz.id)} className="form-button">Zorganizuj
                                    Turniej
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Zorganizuj Turniej</h3>
                        <label>Start:</label>
                        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}/>
                        <label>Koniec:</label>
                        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}/>
                        <div className="modal-actions">
                            <button className="form-button" onClick={createTournament}>Utwórz</button>
                            <button className="form-button" onClick={() => setShowModal(false)}>Anuluj</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};
