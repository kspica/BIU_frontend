import {DashboardLayout} from "../layouts/DashboardLayout";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
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
    const { t } = useTranslation();
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
            alert(t('dashboard.created'));
        } catch (err) {
            console.error("Błąd tworzenia turnieju:", err);
        }
    };


    return (
        <DashboardLayout>
            <h1>{t('dashboard.title')}</h1>
            {quizzes.length === 0 ? (
                <p>{t('dashboard.noQuizzes')}</p>
            ) : (
                <ul className="list-reset">
                    {quizzes.map((quiz) => (
                        <li key={quiz.id} className="list-item-lg">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <p>
                                <strong>{t('quiz.category')}</strong> {quiz.category} | <strong>{t('quiz.difficulty')}</strong> {quiz.difficulty}
                            </p>
                            <div className="button-column">
                                <button onClick={() => handleStart(quiz.id)} className="form-button">{t('dashboard.start')}</button>
                                <button onClick={() => handleChallenge(quiz.id)} className="form-button">{t('dashboard.challenge')}
                                </button>
                                <button onClick={() => openTournamentModal(quiz.id)} className="form-button">{t('dashboard.organize')}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{t('dashboard.tournamentTitle')}</h3>
                        <label>{t('dashboard.startLabel')}</label>
                        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}/>
                        <label>{t('dashboard.endLabel')}</label>
                        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}/>
                        <div className="modal-actions">
                            <button className="form-button" onClick={createTournament}>{t('dashboard.create')}</button>
                            <button className="form-button" onClick={() => setShowModal(false)}>{t('dashboard.cancel')}</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};
