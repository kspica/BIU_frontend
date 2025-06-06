import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContext";
import {LoginForm} from "./components/LoginForm";
import {PrivateRoute} from "./routes/PrivateRoute";
import {EmailVerification} from "./pages/EmailVerification";
import {RegisterForm} from "./auth/RegisterForm";
import {ForgotPasswordForm} from "./components/ForgotPasswordForm";
import {ResetPasswordForm} from "./components/ResetPasswordForm";
import {Dashboard} from "./pages/Dashboard";
import {OAuth2Success} from "./pages/OAuth2Success";
import './styles/common.scss';
import {QuizBuilder} from "./pages/QuizBuilder";
import {QuizProvider} from "./context/QuizContext";
import {QuestionBuilder} from "./pages/QuestionBuilder";
import {MyQuizzes} from "./pages/MyQuizzes";
import {QuizDetails} from "./pages/QuizDetails";
import {QuizPlay} from "./pages/QuizPlay";
import {Leaderboard} from "./pages/Leaderboard";
import {QuizLeaderboard} from "./pages/QuizLeaderboard";
import {QuizSearch} from "./pages/QuizSearch";
import {MultiplayerLobby} from "./components/MultiplayerLobby";
import {MultiplayerGame} from "./pages/MultiplayerGame";
import {Tournaments} from "./pages/Tournament";
import {TournamentLeaderboard} from "./components/TournamentLeaderboard";
import {Statistics} from "./pages/Statistics";


function App() {
    return (
        <AuthProvider>
            <QuizProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard"/>}/>
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/register" element={<RegisterForm/>}/>
                        <Route path="/verify-email" element={<EmailVerification/>}/>
                        <Route path="/forgot-password" element={<ForgotPasswordForm/>}/>
                        <Route path="/reset-password" element={<ResetPasswordForm/>}/>
                        <Route path="/oauth2-success" element={<OAuth2Success/>}/>
                        <Route path="/quiz-builder" element={
                            <PrivateRoute>
                                <QuizBuilder/>
                            </PrivateRoute>}/>
                        <Route path="/quiz-builder/questions" element={
                            <PrivateRoute>
                                <QuestionBuilder/>
                            </PrivateRoute>
                        }
                        />
                        <Route path="/my-quizzes" element={
                            <PrivateRoute>
                                <MyQuizzes/>
                            </PrivateRoute>
                        }
                        />
                        <Route
                            path="/my-quizzes/:quizId"
                            element={
                                <PrivateRoute>
                                    <QuizDetails/>
                                </PrivateRoute>
                            }
                        />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard/>
                            </PrivateRoute>
                        }
                        />
                        <Route path="/multiplayer/:quizId" element={
                            <PrivateRoute>
                                <MultiplayerLobby/>
                            </PrivateRoute>
                        }/>
                        <Route path="/multiplayer/play/:quizId" element={
                            <PrivateRoute>
                                <MultiplayerGame/>
                            </PrivateRoute>
                        }/>
                        <Route path="/tournaments" element={
                            <PrivateRoute>
                                <Tournaments/>
                            </PrivateRoute>
                        }/>

                        <Route path="/tournament/:tournamentId/leaderboard" element={<TournamentLeaderboard/>}/>
                        <Route path="/play/:quizId" element={<QuizPlay/>}/>
                        <Route path="/leaderboard" element={<Leaderboard/>}/>
                        <Route path="/leaderboard/:quizId" element={<QuizLeaderboard/>}/>
                        <Route path="/quiz-search" element={<QuizSearch/>}/>
                        <Route path="/statistics" element={<Statistics/>}/>
                    </Routes>
                </Router>
            </QuizProvider>
        </AuthProvider>
    );
}

export default App;
