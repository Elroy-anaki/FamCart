import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {AuthContext} from "../../context/AuthContext"

import HouseholdOptionsPage from "./HouseholdOptionsPage";
import HouseholdInfoPage from "./HouseholdInfoPage";
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
