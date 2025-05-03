import {useFieldArray, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useQuiz} from "../context/QuizContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {createQuiz} from "../api/quizApi";
import {useState} from "react";

type QuestionFormData = {
    content: string;
    type: "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "OPEN";
    options: { value: string }[];
    correctAnswers: string[];
};

export const QuestionBuilder = () => {
    const {quiz, setQuiz} = useQuiz();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const {register, handleSubmit, watch, control, reset} = useForm<QuestionFormData>({
        defaultValues: {
            type: "SINGLE",
            options: [{value: ""}, {value: ""}],
            correctAnswers: [],
        },
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "options",
    });

    const type = watch("type");

    const onAddQuestion = (data: QuestionFormData) => {
        const formatted = {
            type: data.type,
            content: data.content,
            options: data.options.map((o) => o.value),
            correctAnswers: data.correctAnswers,
        };

        setQuiz({...quiz, questions: [...quiz.questions, formatted]});
        reset({content: "", type: data.type, options: [{value: ""}, {value: ""}], correctAnswers: []});
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createQuiz(quiz);
            navigate("/my-quizzes");
        } catch (err) {
            console.error("Błąd podczas zapisu quizu:", err);
            alert("Wystąpił błąd przy zapisie quizu");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <DashboardLayout>
            <div className="form-container">
                <h2 className="form-title">Dodaj pytanie</h2>

                <form onSubmit={handleSubmit(onAddQuestion)}>
                    <select {...register("type")} className="form-input">
                        <option value="SINGLE">Jednokrotnego wyboru</option>
                        <option value="MULTIPLE">Wielokrotnego wyboru</option>
                        <option value="TRUE_FALSE">Prawda / Fałsz</option>
                        <option value="OPEN">Odpowiedź otwarta</option>
                    </select>

                    <input {...register("content", {required: true})} className="form-input"
                           placeholder="Treść pytania"/>

                    {type !== "OPEN" && (
                        <>
                            <h4>Opcje:</h4>
                            {fields.map((field, index) => (
                                <div key={field.id} style={{display: "flex", gap: "0.5rem"}}>
                                    <input
                                        {...register(`options.${index}.value`, {required: true})}
                                        className="form-input"
                                        placeholder={`Opcja ${index + 1}`}
                                    />
                                    <button type="button" onClick={() => remove(index)}>Usuń</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => append({value: ""})}>+ Dodaj opcję</button>

                            <h4>Poprawne odpowiedzi:</h4>
                            {type === "SINGLE" ? (
                                <select {...register("correctAnswers.0")} className="form-input">
                                    {fields.map((field, index) => (
                                        <option key={field.id}
                                                value={field.value}>{field.value || `Opcja ${index + 1}`}</option>
                                    ))}
                                </select>
                            ) : type === "MULTIPLE" || type === "TRUE_FALSE" ? (
                                fields.map((field, index) => (
                                    <label key={field.id}>
                                        <input
                                            type="checkbox"
                                            value={field.value}
                                            {...register("correctAnswers")}
                                        /> {field.value || `Opcja ${index + 1}`}
                                    </label>
                                ))
                            ) : null}
                        </>
                    )}

                    <button type="submit" className="form-button">Dodaj pytanie</button>
                </form>

                <button onClick={onSubmit} className="form-button" disabled={isSubmitting}> {isSubmitting ? "Zapisywanie..." : "Zakończ i zapisz quiz"}</button>
                <button onClick={() => navigate("/quiz-builder")} className="form-button">Wstecz</button>
            </div>
        </DashboardLayout>
    );
};
