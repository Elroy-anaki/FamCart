import * as Yup from "yup"


export const validationSingUpSchema = Yup.object({
  userName: Yup.string()
    .min(2, "The name must contain at least 2 characters")
    .max(20, "The name cannot exceed 20 characters")
    .required("Name is a required field"),
  userEmail: Yup.string()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address")
    .required("Email is a required field"),
  userPassword: Yup.string()
    .min(5, "The password must contain at least 5 characters")
    .required("Password is a required field"),
});

export const validationSignInSchema = Yup.object({
  userEmail: Yup.string().email("Invalid email address").required("Invalid email address"),
  userPassword: Yup.string()
    .min(5, "Must have at least 5 characters")
    .required("Must have at least 5 characters"),
});

export const validationEditProfileSchema = Yup.object({
  userName: Yup.string()
    .min(2, "The name must contain at least 2 characters")
    .max(20, "The name cannot exceed 20 characters")
    .required("Name is a required field"),
  userEmail: Yup.string()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address")
    .required("Email is a required field"),

});

