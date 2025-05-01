import { lazy, useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ErrorPage = lazy(() => import("./pages/ErrorPage/ErrorPage"));
const Home = lazy(() => import("./pages/Home/Home"));
const SignIn = lazy(() => import("./forms/Auth/SignIn/SignIn"));
const SignUp = lazy(() => import("./forms/Auth/SingUp/SingUp"));
const ForgotPassword = lazy(() =>
  import("./forms/Auth/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("./forms/Auth/ResetPassword/ResetPassword")
);
const EmailVerification = lazy(() =>
  import("./forms/Auth/EmailVerification/EmailVerification")
);
const NavBar = lazy(() => import("./components/NavBar/NavBar"));

function Root() {
  return (
    <>
      <div className="flex flex-col">
        <header className="h-[10vh]">
          <NavBar />
        </header>
        <main className="h-[90vh]">
          <Outlet />
        </main>

        {/* Modals */}
      </div>
    </>
  );
}

function App() {
  const { isAuth } = useContext(AuthContext);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />

        {/* Public Routes */}
        <Route
          path="/auth"
          element={!isAuth ? <Outlet /> : <Navigate to={"/"} />}
        >
          <Route index element={<SignIn />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route
            path="email-verification/:userId"
            element={<EmailVerification />}
          />
        </Route>
      </Route>
    )
  );

  return (
    <div>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      />
    </div>
  );
}

export default App;
