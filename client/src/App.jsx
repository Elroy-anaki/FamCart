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
  import("./pages/Household/CreateNewHousehold/CreateNewHousehold")
);
const ShoppingCartPage = lazy(() => import("./pages/ShoppingCart/ShoppingCartPage"))

const CreateRecipe = lazy(() => import("./forms/recipes/CreateRecipe"))

const RecipePage = lazy(() => (import("./pages/Recipe/RecipePage")))

const Recipes = lazy(() => import("./components/Recipes/Recipes"))

const ActiveCarts = lazy(() => import("./pages/ShoppingCart/ActiveCartsPage"))

const CartsHistory = lazy(() => import("./components/ShoppingCart/CartsHistory"))

const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"))


function Root() {
  const { isAuth } = useContext(AuthContext);
  return (
    <div className="flex flex-col h-screen">
      <header className="h-[10vh]">
        {isAuth ?<NavBar /> : null }
        
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
        <Route index element={isAuth ? <Home /> : <SignIn />} />
        <Route path="household" element={isAuth ? <Home /> : null} />

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
        <Route path="/profile" element={isAuth ? <ProfilePage /> : <Navigate  to="/" replace/>}/>
        <Route
          path="/household"
          element={isAuth ? <Outlet /> : <Navigate to="/" />}
        >
          <Route path="create-new" element={<CreateNewHousehold />} />
          <Route path="carts-active" element={<ActiveCarts />} />
          <Route path="carts-history" element={<CartsHistory />} />
          <Route path="shopping-cart/:cartId" element={<ShoppingCartPage />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/create-new" element={<CreateRecipe />} />
          <Route path="recipes/:id" element={<RecipePage />} />
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
