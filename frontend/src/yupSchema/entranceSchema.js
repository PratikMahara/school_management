import * as yup from 'yup'

export const entranceSchema = yup.object({
    name: yup.string().min(4, "Name must contain 5 character").required("Full name is required"),
    address: yup.string().required("Address is required"),
    email: yup.string().email("It must be an  Email").min(2, "Email must contain 2 characters").required("Email is required"),
    phone: yup.number().typeError("That doesn't look like a phone number").positive("A phone number can't start with a minus").integer("A phone number can't include a decimal point").min(10).required('A phone number is required'),
    classId: yup.string().required("Select one option"),
    preschool: yup.string().min(4,"School name must contain 4 characters").required("School Name is required"),
});