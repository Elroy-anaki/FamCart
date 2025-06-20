import React, { useContext, useEffect } from "react";
import { Formik } from "formik";
import {validationSignInSchema} from "../../../schemas/userForms";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { notifyError, notifySuccess } from "../../../lib/Toasts";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { HouseholdContext } from "../../../context/HouseholdContext";

const initialUserValues = {
  userEmail: "",
  userPassword: "",
};

function SignIn() {

  const { isAuth, signIn } = useContext(AuthContext);
  const {getHouseholdInfo,} = useContext(HouseholdContext)
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuth) {
      return
    }
    navigate("/household")
  },[isAuth])

  return (
    <div className="flex items-center justify-center py-20 md:py-16 px-4 md:px-0">
      <Formik
        initialValues={initialUserValues}
        validationSchema={validationSignInSchema}
        onSubmit={async (values, actions) => {
          try {
            await signIn(values);
            actions.resetForm();
            await getHouseholdInfo()
            notifySuccess('Welcome!');
            navigate('/');
          } catch (error) {
            console.log(error);
            notifyError(error.response.data.msg);
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
            className="relative bg-white shadow-lg pt-12 pb-20 md:shadow-2xl max-w-sm md:max-w-lg w-full mx-auto rounded-xl p-6 md:p-10 border-2 border-green-200"
          >
            <div className="mb-6 md:mb-8 text-center">
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                Welcome Back!
              </h3>
            </div>
  
            <div className="space-y-6 md:space-y-8">
              <div>
                <label
                  htmlFor="userEmail"
                  className="block text-gray-700 font-medium text-sm md:text-base"
                >
                  Email Address
                </label>
                <input
                  className="mt-1 md:mt-2 text-gray-800 bg-white border border-gray-300 w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  placeholder="example@gmail.com"
                  value={values.userEmail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.userEmail && errors.userEmail && (
                  <div className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.userEmail}
                  </div>
                )}
              </div>
  
              <div>
                <label
                  htmlFor="userPassword"
                  className="block text-gray-700 font-medium text-sm md:text-base"
                >
                  Password
                </label>
                <input
                  className="mt-1 md:mt-2 text-gray-800 bg-white border border-gray-300 w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  id="userPassword"
                  name="userPassword"
                  type="password"
                  placeholder="*******"
                  value={values.userPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.userPassword && errors.userPassword && (
                  <div className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.userPassword}
                  </div>
                )}
              </div>
  
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 md:py-3 px-4 md:px-6 text-white rounded-lg font-semibold tracking-wide text-sm md:text-base ${isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 via-green-500 to-green-700 hover:from-green-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transform transition-all hover:scale-105"
                  }`}
              >
                {isSubmitting ? "Processing..." : "Sign In"}
              </button>
              
              {/* <div className="w-full py-2 md:py-3 flex justify-center items-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    signInWithGoogle(jwtDecode(credentialResponse.credential), false);
                    navigate("/auth/sign-in");
                  }}
                  onError={() => console.log("Login failed")}
                  auto_select={true}
                  size="large"
                  shape="circle"
                  logo_alignment="left"
                  login_uri=""
                />
              </div> */}
  
              <div className="text-center text-gray-600 text-xs md:text-sm mt-2 md:mt-4">
                <p>
                  Forgot your password? {" "}
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