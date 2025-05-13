import { useContext, useState, useEffect } from "react";
import { HouseholdContext } from "../../context/HouseholdContext";
import { ShoppingCartsInfo } from "../../components/ShoppingCartsInfo/ShoppingCartsInfo";
import { HouseholdMembers } from "../../components/Household/HouseHoldMembers/HouseholdMemebers";

export default function HouseholdInfoPage() {

  const { householdInfo } = useContext(HouseholdContext);
  console.log(householdInfo)



  return (
    <>
     <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
    {/* Page Header */}
    <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-600">Welcome to {householdInfo?.householdName} Household</h1>
        </div>
    <ShoppingCartsInfo />
    <div className="flex justify-between items-center">
    <div className="flex justify-between gap-3 items-center rounded-2xl text-white p-4  bg-green-600">
    <h3 className="text-xl">Budget</h3>
      <p className="text-lg text-blue-800">

      {householdInfo?.householdBudget}
      </p>
    </div>
    <div className="flex justify-between items-center gap-3 rounded-2xl text-white p-4  bg-green-600">
      <h3 className="text-xl">Join Code</h3>
      <p className="text-lg text-blue-800">

      {householdInfo?.householdJoinCode}
      </p>
    </div>
    </div>
    <HouseholdMembers members={householdInfo?.householdMembers} owner={householdInfo.householdOwner}/>
    </div>
    </>
  );
}

