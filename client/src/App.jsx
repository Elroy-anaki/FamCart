import { lazy, Suspense, useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Lazy imports
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

const CreateNewHousehold = lazy(() =>
  import("./pages/CreateNewHousehold/CreateNewHousehold")
);
const ShoppingCartPage = lazy(() => import("./components/ShoppingCart/ShoppingCartPage"))

function Root() {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-[10vh]">
        <NavBar />
      </header>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function AppRoutes() {
  const { isAuth } = useContext(AuthContext);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index element={<div>Home Page</div> } />
        <Route path="household" element={<Home />} />

        {/* Public Routes */}
        <Route
          path="/auth"
          element={!isAuth ? <Outlet /> : <Navigate to="/" replace />}
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

        {/* Private Routes */}
        <Route
          path="/household"
          element={isAuth ? <Outlet /> : <Navigate to="/" />}
        >
          <Route path="create-new" element={<CreateNewHousehold />} />
          <Route path="shopping-cart/:cartId" element={<ShoppingCartPage />} />
          </Route>
      </Route>
    )
  );

  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}

function App() {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
