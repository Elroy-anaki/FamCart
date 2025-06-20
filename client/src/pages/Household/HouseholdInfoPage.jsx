import { useContext, useState } from "react";
import { HouseholdContext } from "../../context/HouseholdContext";
import { ShoppingCartsInfo } from "../../components/ShoppingCart/ShoppingCartsInfo";
import { HouseholdMembers } from "../../components/Household/HouseholdMemebers";
import { HouseholdShoppingDays } from "../../components/Household/HouseholdShoppingDays";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function HouseholdInfoPage() {
  const { householdInfo } = useContext(HouseholdContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState("")
  const queryClient = useQueryClient();

  const handleEditClick = () => {
    setIsEditing(true);
    setNewBudget(householdInfo?.householdBudget || "");
  };

  const handleChange = (e) => {
    setNewBudget(e.target.value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewBudget("");
  };

  const { mutate: updateBudget } = useMutation({
    mutationKey: ["updateHousehold"],
    mutationFn: async () =>
      (
        await axios.put(`/households/update/${householdInfo._id}`, {
          householdBudget: newBudget
        })
      ).data,
    onSuccess: () => {
      notifySuccess("Update budget successful!");
      queryClient.invalidateQueries({ queryKey: ["getHouseholdInfo"] });
      setIsEditing(false);
      setNewBudget("");
    },
    onError: (error) => {
      console.log(error);
      notifyError("Update failed!");
    },
  });

  const { mutate: changeJoinCode } = useMutation({
    mutationKey: ["changeJoinCode"],
    mutationFn: async () =>
      (
        await axios.put(`/households/change-join-code/${householdInfo._id}`)
      ).data,
    onSuccess: () => {
      notifySuccess("Update successful!");
      queryClient.invalidateQueries({ queryKey: ["getHouseholdInfo"] });
    },
    onError: (error) => {
      console.log(error);
      notifyError("Update failed!");
    },
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-600">
          Welcome to {householdInfo?.householdName} Household
        </h1>
      </div>

      <ShoppingCartsInfo />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Budget Section */}
        <div className="flex gap-3 items-center rounded-2xl text-white p-4 bg-green-600 w-full md:w-1/2">
          <h3 className="text-xl">Budget</h3>
          {isEditing ? (
            <>
              <input
                type="number"
                value={newBudget}
                onChange={handleChange}
                className="text-blue-800 rounded px-2 py-1 w-24 bg-white"
                autoFocus
              />
              <button
                onClick={() => updateBudget()}
                className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-green-100"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white font-semibold px-3 py-1 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <p
              className="text-lg text-blue-800 cursor-pointer hover:underline"
              onClick={handleEditClick}
            >
              {householdInfo?.householdBudget}
            </p>
          )}
        </div>

        {/* Join Code Section */}
        <div className="flex gap-3 items-center rounded-2xl text-white p-4 bg-green-600 w-full md:w-1/2">
          <h3 className="text-xl">Join Code</h3>
          <p className="text-lg text-blue-800">{householdInfo?.householdJoinCode}</p>
          <button
            onClick={changeJoinCode}
            className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-green-100"
          >
            Reset Code
          </button>
        </div>
      </div>

      <div className="w-full">
        <HouseholdShoppingDays shoppingDays={householdInfo?.householdShoppingDays} />
      </div>

      <div className="w-full">
        <HouseholdMembers
          members={householdInfo?.householdMembers}
          owner={householdInfo?.householdOwner}
        />
      </div>
    </div>
  );
}