import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {useTranslation} from "react-i18next";

interface Player {
    id: string;
    name: string;
}

export const MultiplayerLobby = () => {
    const {quizId} = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [roomId] = useState(uuidv4());
    const [players, setPlayers] = useState<Player[]>([
        {id: "1", name: "Ty (Gracz 1)"}
    ]);

    useEffect(() => {
        // Zmockowane dołączenie drugiego gracza po 3 sekundach
        const timer = setTimeout(() => {
            setPlayers([
                {id: "1", name: "Ty (Gracz 1)"},
                {id: "2", name: "Gracz 2 (symulowany)"}
            ]);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (players.length === 2) {
            const startTimer = setTimeout(() => {
                navigate(`/multiplayer/play/${quizId}?roomId=${roomId}`);
            }, 2000);

            return () => clearTimeout(startTimer);
        }
    }, [players, quizId, navigate, roomId]);

    return (
        <DashboardLayout>
            <div className="lobby-container">
                <h2>{t('multiplayerLobby.title')}</h2>
                <p><strong>{t('multiplayerLobby.roomId')}</strong> {roomId}</p>
                <p><strong>{t('multiplayerLobby.quizId')}</strong> {quizId}</p>

                <h3>{t('multiplayerLobby.players')}</h3>
                <ul>
                    {players.map(player => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </ul>

                {players.length < 2 ? (
                    <p>{t('multiplayerLobby.waiting')}</p>
                ) : (
                    <p>{t('multiplayerLobby.ready')}</p>
                )}
            </div>
        </DashboardLayout>
    );
};
