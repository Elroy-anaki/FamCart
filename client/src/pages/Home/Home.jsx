import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { HouseholdContext } from "../../context/HouseholdContext";
import HouseholdOptionsPage from "../Household/HouseholdOptionsPage";
import HouseholdInfoPage from "../Household/HouseholdInfoPage";

function Home() {
  const { user } = useContext(AuthContext);
  const { householdInfo } = useContext(HouseholdContext);

  if (!user) return <Navigate to="/auth/sign-in" replace />;

  if (!householdInfo) {
    return <HouseholdOptionsPage />;
  }

  return <HouseholdInfoPage />;
}

export default Home;
