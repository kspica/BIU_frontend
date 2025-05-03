import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

import axios from "axios";

interface Question {
  id: number;
  content: string;
  type: string;
  options: string[];
  correctAnswers: string[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questions: Question[];
}

export const QuizDetails = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { token } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/quizzes/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuiz(res.data);
      } catch (error) {
        console.error("Błąd podczas pobierania szczegółów quizu", error);
      }
    };

    fetchQuiz();
  }, [quizId, token]);

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="form-container"><p>Ładowanie quizu...</p></div>
      </DashboardLayout>
    );
  }

  return (
      <DashboardLayout>
        <div className="form-container">
          <h2 className="form-title">{quiz.title}</h2>
          <p><strong>Kategoria:</strong> {quiz.category}</p>
          <p><strong>Poziom trudności:</strong> {quiz.difficulty}</p>
          <p><strong>Opis:</strong> {quiz.description}</p>

          <h3>Pytania</h3>
          {quiz.questions.map((q, index) => (
              <div key={q.id}
                   style={{marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px"}}>
                <p><strong>{index + 1}. {q.content}</strong></p>
                {q.options && q.options.length > 0 && (
                    <ul>
                      {q.options.map((opt, i) => (
                          <li key={i}>
                            {opt} {q.correctAnswers.includes(opt) ? "(✅ poprawna)" : ""}
                          </li>
                      ))}
                    </ul>
                )}
                {q.type === "OPEN" && (
                    <p><em>Odpowiedź otwarta</em></p>
                )}
              </div>
          ))}
        </div>
        <button className="form-button" onClick={() => navigate("/my-quizzes")}>
          ← Wróć do moich quizów
        </button>
      </DashboardLayout>
  );
};
