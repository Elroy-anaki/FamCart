import React, { useContext, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Formik } from "formik";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { validationSingUpSchema } from "../../../schemas/userForms";
import Input from "./Input";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function SingUp() {
  const { signUp, signUpGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function signUpWithGoogle(credentials) {
    const signUpValues = {
      userName: credentials.name,
      userEmail: credentials.email,
      userPassword: credentials.sub,
      verify: true,
    };

    await signUpGoogle(signUpValues);
    console.log("Sign-up successful");
  }

  return (
    <div className="flex items-center justify-center py-20 md:py-5 px-4 md:px-0">
      <Formik
        initialValues={{
          userName: "",
          userEmail: "",
          userPassword: "",
        }}
        validationSchema={validationSingUpSchema}
        onSubmit={async (values, actions) => {
          console.log(values);
          signUp(values);
          actions.resetForm();
          navigate("/auth/sign-in");
        }}
      >
        {({ isSubmitting, values, handleBlur, handleChange, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="relative bg-white/95 pt-12 pb-18 backdrop-blur-sm w-full max-w-sm md:max-w-xl mx-auto shadow-lg md:shadow-2xl border-2 border-green-200 p-4 md:p-8 rounded-xl"
          >
            <div className="mb-6 md:mb-12 text-center">
              <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                Welcome to FamCat!
              </h3>
              <p className="text-black mt-2 md:mt-5 text-base md:text-lg">
                Thanks for you decided to join us 🥳
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <Input
                type="text"
                name="userName"
                id="userName"
                value={values.userName}
                placeholder="Enter your name"
                required=""
                label={"Full Name"}
                onBlur={handleBlur}
                onChange={handleChange}
                Icon={FaUser}
              />

              <Input
                type="email"
                name="userEmail"
                id="userEmail"
                value={values.userEmail}
                placeholder="Enter your email"
                required=""
                label={"Email Address"}
                onBlur={handleBlur}
                onChange={handleChange}
                Icon={FaEnvelope}
              />

              <Input
                type={showPassword ? "text" : "password"}
                name="userPassword"
                id="userPassword"
                value={values.userPassword}
                placeholder="Create a password"
                required=""
                label={"Password"}
                onBlur={handleBlur}
                onChange={handleChange}
                Icon={FaLock}
                FaEyeSlash={FaEyeSlash}
                FaEye={FaEye}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 md:py-3 px-4 md:px-6 text-white rounded-lg font-semibold tracking-wide cursor-pointer text-sm md:text-base
                  ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transform transition-all hover:scale-[1.02]"
                  }`}
              >
                {isSubmitting ? "Creating Account..." : "Join Now"}
              </button>
              
              <div className="w-full flex justify-center py-2 md:py-3">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    signUpWithGoogle(jwtDecode(credentialResponse.credential));
                    navigate("/auth/sign-in");
                  }}
                  onError={() => console.log("Login failed")}
                  auto_select={true}
                  size="large"
                  shape="circle"
                  logo_alignment="left"
                  login_uri=""
                />
              </div>

              <p className="text-center text-gray-600 text-xs md:text-sm mt-2">
                Already have an account?{" "}
                <Link
                  to={"/auth/sign-in"}
                  className="text-green-500 font-semibold hover:text-green-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default SingUp;