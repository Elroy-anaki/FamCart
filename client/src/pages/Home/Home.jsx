import { useContext, useState } from "react";

import {AuthContext} from "../../context/AuthContext"

import HouseholdOptionsPage from "../Household/HouseholdOptionsPage";
import HouseholdInfoPage from "../Household/HouseholdInfoPage";
import { HouseholdContext } from "../../context/HouseholdContext";

function Home() {
  
  const {user} = useContext(AuthContext)
  const {householdInfo} = useContext(HouseholdContext)

  if (!householdInfo && user){
    return (
      <>
      <HouseholdOptionsPage />
      </>
    )
  }
  return(
    <> <HouseholdInfoPage /></>
  )
 

  
}

export default Home;
