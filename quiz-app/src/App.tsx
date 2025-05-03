import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContext";
import {LoginForm} from "./components/LoginForm";
import {PrivateRoute} from "./routes/PrivateRoute";
import {EmailVerification} from "./pages/EmailVerification";
import {RegisterForm} from "./auth/RegisterForm";
import {ForgotPasswordForm} from "./components/ForgotPasswordForm";
import {ResetPasswordForm} from "./components/ResetPasswordForm";
import {Dashboard} from "./pages/Dashboard";
import {OAuth2Success} from "./pages/OAuth2Success";
import './styles/forms.scss';
import {QuizBuilder} from "./pages/QuizBuilder";
import {QuizProvider} from "./context/QuizContext";
import {QuestionBuilder} from "./pages/QuestionBuilder";
import {MyQuizzes} from "./pages/MyQuizzes";
import {QuizDetails} from "./pages/QuizDetails";


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
                    </Routes>
                </Router>
            </QuizProvider>
        </AuthProvider>
    );
}

export default App;
