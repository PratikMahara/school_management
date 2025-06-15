import * as yup from 'yup';

export const classSchema = yup.object({
    class_num: yup.number().required("Class Number is  required."),
    class_section: yup.string().min(3,"Must Contain 3 Character.").required("Class Text is  required."),
    class_teacher: yup.string().required("Class Teacher is required."),
})