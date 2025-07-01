import * as Yup from "yup";

export const validationSingUpSchema = Yup.object({
  userName: Yup.string()
    .trim()
    .min(2, "השם חייב להכיל לפחות 2 תווים")
    .max(20, "השם לא יכול להיות ארוך מ-20 תווים")
    .required("שם הוא שדה חובה"),
  userEmail: Yup.string()
    .email("כתובת האימייל אינה חוקית")
    .required("אימייל הוא שדה חובה"),
  userPassword: Yup.string()
    .min(5, "הסיסמה חייבת להכיל לפחות 5 תווים")
    .required("סיסמה היא שדה חובה"),
});

export const validationSignInSchema = Yup.object({
  userEmail: Yup.string()
    .email("כתובת האימייל אינה חוקית")
    .required("אימייל הוא שדה חובה"),
  userPassword: Yup.string()
    .min(5, "הסיסמה חייבת להכיל לפחות 5 תווים")
    .required("סיסמה היא שדה חובה"),
});

export const validationEditProfileSchema = Yup.object({
  userName: Yup.string()
    .trim()
    .min(2, "השם חייב להכיל לפחות 2 תווים")
    .max(20, "השם לא יכול להיות ארוך מ-20 תווים")
    .required("שם הוא שדה חובה"),
  userEmail: Yup.string()
    .email("כתובת האימייל אינה חוקית")
    .required("אימייל הוא שדה חובה"),
});
