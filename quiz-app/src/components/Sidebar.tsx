import { NavLink } from "react-router-dom";
import "../styles/forms.scss";

export const Sidebar = () => (
    <aside className="sidebar">
        <h2 className="logo">QUIZAPP</h2>
        <nav>
            <ul>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/quiz-builder">Quiz Creator</NavLink></li>
                <li><NavLink to="/my-quizzes">Moje quizy</NavLink></li>
            </ul>
        </nav>
    </aside>
);
