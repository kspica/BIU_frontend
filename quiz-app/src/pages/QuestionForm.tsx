import {useFieldArray, useForm} from "react-hook-form";
import {QuestionType} from "../context/QuizContext";
import {useTranslation} from "react-i18next";

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

    const { t } = useTranslation();

    const {fields, append, remove} = useFieldArray({control, name: "options"});
    const type = watch("type");

    const handleLocalSubmit = (data: QuestionFormData) => {
        onSubmit(data);
        reset({content: "", type: data.type, options: [{value: ""}, {value: ""}], correctAnswers: []});
    };

    return (
        <form onSubmit={handleSubmit(handleLocalSubmit)}>
            <select {...register("type")} className="form-input">
                <option value="SINGLE">{t('questionForm.single')}</option>
                <option value="MULTIPLE">{t('questionForm.multiple')}</option>
                <option value="TRUE_FALSE">{t('questionForm.true_false')}</option>
                <option value="OPEN">{t('questionForm.open')}</option>
            </select>

            <input {...register("content", {required: true})} className="form-input" placeholder={t('questionForm.content')}/>

            {type !== "OPEN" && (
                <>
                    <h4>{t('questionForm.options')}</h4>
                    {fields.map((field, index) => (
                        <div key={field.id} className="form-option-row">
                            <input
                                {...register(`options.${index}.value`, {required: true})}
                                className="form-input"
                                placeholder={`${t('questionForm.option')} ${index + 1}`}
                            />
                            <button type="button" className="delete-button" onClick={() => remove(index)}>{t('questionForm.delete')}</button>
                        </div>
                    ))}
                    <button type="button" className="form-button" onClick={() => append({value: ""})}>+ {t('questionForm.addOption')}
                    </button>

                    <h4>{t('questionForm.correct')}</h4>
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
                                {opt.value || `${t('questionForm.option')} ${index + 1}`}
                            </label>
                        ))
                    )}
                </>
            )}

            <button type="submit" className="form-button">{t('questionForm.add')}</button>
        </form>
    );
};
