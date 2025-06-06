import {useFieldArray, useForm} from "react-hook-form";
import {QuestionType} from "../context/QuizContext";

export type QuestionFormData = {
    content: string;
    type: QuestionType;
    options: { value: string }[];
    correctAnswers: string[];
};

interface Props {
    onSubmit: (q: QuestionFormData) => void;
    initialType?: QuestionType;
}

export const QuestionForm = ({onSubmit, initialType = "SINGLE"}: Props) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch
    } = useForm<QuestionFormData>({
        defaultValues: {
            content: "",
            type: initialType,
            options: [{value: ""}, {value: ""}],
            correctAnswers: [],
        }
    });

    const {fields, append, remove} = useFieldArray({control, name: "options"});
    const type = watch("type");

    const handleLocalSubmit = (data: QuestionFormData) => {
        onSubmit(data);
        reset({content: "", type: data.type, options: [{value: ""}, {value: ""}], correctAnswers: []});
    };

    return (
        <form onSubmit={handleSubmit(handleLocalSubmit)}>
            <select {...register("type")} className="form-input">
                <option value="SINGLE">Jednokrotnego wyboru</option>
                <option value="MULTIPLE">Wielokrotnego wyboru</option>
                <option value="TRUE_FALSE">Prawda / Fałsz</option>
                <option value="OPEN">Odpowiedź otwarta</option>
            </select>

            <input {...register("content", {required: true})} className="form-input" placeholder="Treść pytania"/>

            {type !== "OPEN" && (
                <>
                    <h4>Opcje:</h4>
                    {fields.map((field, index) => (
                        <div key={field.id} className="form-option-row">
                            <input
                                {...register(`options.${index}.value`, {required: true})}
                                className="form-input"
                                placeholder={`Opcja ${index + 1}`}
                            />
                            <button type="button" className="delete-button" onClick={() => remove(index)}>Usuń</button>
                        </div>
                    ))}
                    <button type="button" className="form-button" onClick={() => append({value: ""})}>+ Dodaj opcję
                    </button>

                    <h4>Poprawne odpowiedzi:</h4>
                    {type === "SINGLE" ? (
                        <select {...register("correctAnswers.0")} className="form-input">
                            {watch("options").map((opt, index) => (
                                <option key={index} value={opt.value}>
                                    {opt.value || `Opcja ${index + 1}`}
                                </option>
                            ))}
                        </select>
                    ) : (
                        watch("options").map((opt, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    value={opt.value}
                                    {...register("correctAnswers")}
                                />
                                {opt.value || `Opcja ${index + 1}`}
                            </label>
                        ))
                    )}
                </>
            )}

            <button type="submit" className="form-button">Dodaj pytanie</button>
        </form>
    );
};
