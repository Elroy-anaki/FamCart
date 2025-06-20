import { createContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { notifyError, notifySuccess } from "../lib/Toasts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HouseholdProvider from "./HouseholdContext";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [hasVerified, setHasVerified] = useState(false);

  useQuery({
    queryKey: ["verifyToken"],
    queryFn: async () => {
      const { data } = await axios.get("/auth/verify-token");
      setIsAuth(data.success);
      setUser(data.data.payload);
      setHasVerified(true); 
      return data;
    },
    enabled: !hasVerified, 
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    retry: 1,
  });

  const { mutateAsync: signIn } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (data) => await axios.post(`/users/sign-in`, data),
    onSuccess: (data) => {
      setIsAuth(true);
      setUser(data.data.data);
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });

  const { mutate: signUp } = useMutation({
    mutationKey: ["SingUp"],
    mutationFn: async (data) => await axios.post("/users/sign-up", data),
    onSuccess: (data) => {
      notifySuccess("Welcome! Check your email...");
    },
    onError: (error) => {
      notifyError(error.response.data.msg);
    },
  });

  // const { mutate: signUpGoogle } = useMutation({
  //   mutationKey: ["signUpWithGoogle"],
  //   mutationFn: async (data) => await axios.post("/users/sign-up/google", data),
  //   onSuccess: async (data) => {
  //     await signInWithGoogle(data.data.data);
  //     notifySuccess("Welcome To Our Restaurant Please sign in!");
  //   },
  //   onError: (error) => {
  //     notifyError(error);
  //   },
  // });

  // async function signInWithGoogle(credentials, afterSignUp = true) {
  //   console.log(credentials);
  //   const signInValues = {
  //     userEmail: afterSignUp ? credentials.userEmail : credentials.email,
  //     userPassword: afterSignUp ? credentials.userPassword : credentials.sub,
  //   };
  //   await signIn(signInValues);
  // }

  const { refetch: signOut } = useQuery({
    queryKey: ["signOut"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/auth/sign-out");
        setIsAuth(false);
        setUser(null);
      } catch (error) {
        console.log(error);
      }
    },
    enabled: false,
  });

  const { mutate: verifyEmail } = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: async (userId) =>
      await axios.get(`/auth/email-verification?userId=${userId}&type=user`),
    onSuccess: (data) => {
      notifySuccess("verify");
    },
    onError: (error) => {
      return;
    },
  });

  const authGlobalState = {
    user,
    setUser,
    isAuth,
    setIsAuth,
    signUp,
    // signUpGoogle,
    // signInWithGoogle,
    signIn,
    signOut,
    verifyEmail,
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <AuthContext.Provider value={authGlobalState}>
        <HouseholdProvider>
        {children}
        </HouseholdProvider>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
export default AuthProvider;
