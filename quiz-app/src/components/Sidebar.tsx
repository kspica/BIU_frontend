import {NavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";
import "../styles/forms.scss";

export const Sidebar = () => {
    const { t } = useTranslation();
    return (
        <aside className="sidebar">
            <h2 className="logo">QUIZAPP</h2>
            <nav>
                <ul>
                    <li><NavLink to="/dashboard">{t('sidebar.dashboard')}</NavLink></li>
                    <li><NavLink to="/quiz-builder">{t('sidebar.quizCreator')}</NavLink></li>
                    <li><NavLink to="/my-quizzes">{t('sidebar.myQuizzes')}</NavLink></li>
                    <li><NavLink to="/quiz-search">{t('sidebar.quizSearch')}</NavLink></li>
                    <li><NavLink to="/leaderboard">{t('sidebar.leaderboard')}</NavLink></li>
                    <li><NavLink to="/tournaments">{t('sidebar.tournaments')}</NavLink></li>
                    <li><NavLink to="/statistics" className="nav-link">{t('sidebar.statistics')}</NavLink></li>

                </ul>
            </nav>
        </aside>
    );
};
