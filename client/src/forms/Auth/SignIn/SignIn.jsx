import React, { useContext, useEffect } from "react";
import { Formik } from "formik";
import { validationSignInSchema } from "../../../schemas/userForms";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { notifyError, notifySuccess } from "../../../lib/Toasts";
import { HouseholdContext } from "../../../context/HouseholdContext";

const initialUserValues = {
  userEmail: "",
  userPassword: "",
};

function SignIn() {
  const { isAuth, signIn } = useContext(AuthContext);
  const { getHouseholdInfo } = useContext(HouseholdContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate("/household");
  }, [isAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-6 ">
      {/* 🖼️ Image at the top */}
      {/* <img
        src="/FamCart.png" 
        alt="Signin Header"
        className="w-full max-h-64 object-cover rounded-lg shadow-md mb-6"
      /> */}

      {/* 📝 Sign-in Form */}
      <Formik
        initialValues={initialUserValues}
        validationSchema={validationSignInSchema}
        onSubmit={async (values, actions) => {
          try {
            await signIn(values);
            actions.resetForm();
            await getHouseholdInfo();
            notifySuccess("Welcome!");
            navigate("/");
          } catch (error) {
            console.log(error);
            notifyError("Email or Password wrong");
          }
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          isSubmitting,
          handleSubmit,
          touched,
          errors,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg max-w-sm md:max-w-lg w-full mx-auto rounded-xl p-6 md:p-10 border border-green-200"
          >
            <div className="mb-6 text-center">
              <h3 className="text-3xl font-bold text-green-600">
                Welcome Back!
              </h3>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="userEmail"
                  className="block text-gray-700 font-medium"
                >
                  Email Address
                </label>
                <input
                  className="mt-1 text-gray-800 bg-white border border-gray-300 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  placeholder="example@gmail.com"
                  value={values.userEmail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.userEmail && errors.userEmail && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.userEmail}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="userPassword"
                  className="block text-gray-700 font-medium"
                >
                  Password
                </label>
                <input
                  className="mt-1 text-gray-800 bg-white border border-gray-300 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  id="userPassword"
                  name="userPassword"
                  type="password"
                  placeholder="*******"
                  value={values.userPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.userPassword && errors.userPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.userPassword}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 text-white rounded-lg font-semibold tracking-wide ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                }`}
              >
                {isSubmitting ? "Processing..." : "Sign In"}
              </button>

              {/* Links */}
              <div className="text-left text-gray-600 text-sm mt-4">
                <p>
                  Don't have an account yet?{" "}
                  <Link
                    to={"/auth/sign-up"}
                    className="text-green-500 font-semibold hover:text-green-600"
                  >
                    Sign Up here
                  </Link>
                </p>
              </div>

              <div className="text-center text-gray-600 text-sm mt-2">
                <p>
                  Forgot your password?{" "}
                  <Link
                    to={"/auth/forgot-password"}
                    className="text-green-500 font-semibold hover:text-green-600"
                  >
                    Reset it here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default SignIn;
