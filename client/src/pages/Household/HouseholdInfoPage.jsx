import { useContext, useState } from "react";
import { HouseholdContext } from "../../context/HouseholdContext";
import { ShoppingCartsInfo } from "../../components/ShoppingCartsInfo/ShoppingCartsInfo";
import { HouseholdMembers } from "../../components/Household/HouseholdMembers/HouseholdMemebers";
import { HouseholdShoppingDays } from "../../components/Household/HouseholdShoppingDays/HouseholdShoppingDays";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function HouseholdInfoPage() {
  const { householdInfo } = useContext(HouseholdContext);
  const [isEditing, setIsEditing] = useState({ field: null, value: "" });
  const [showSave, setShowSave] = useState(false);
  const queryClient = useQueryClient();

  const handleEditClick = (field, value) => {
    setIsEditing({ field, value });
  };

  const handleChange = (e) => {
    setIsEditing((prev) => ({ ...prev, value: e.target.value }));
    setShowSave(true);
  };

  const { mutate: updateHousehold } = useMutation({
    mutationKey: ["updateHousehold"],
    mutationFn: async () =>
      (
        await axios.put(`/households/update/${householdInfo._id}`, {
          [isEditing.field]: isEditing.value,
        })
      ).data,
    onSuccess: () => {
      notifySuccess("Update successful!");
      queryClient.invalidateQueries({ queryKey: ["getHouseholdInfo"] });
      setShowSave(false);
      setIsEditing({ field: null, value: "" });
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
          {isEditing.field === "householdBudget" ? (
            <>
              <input
                type="number"
                value={isEditing.value}
                onChange={handleChange}
                className="text-blue-800 rounded px-2 py-1 w-24 bg-white"
              />
              {showSave && (
                <button
                  onClick={updateHousehold}
                  className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-green-100"
                >
                  Save
                </button>
              )}
            </>
          ) : (
            <p
              className="text-lg text-blue-800 cursor-pointer hover:underline"
              onClick={() =>
                handleEditClick("householdBudget", householdInfo?.householdBudget)
              }
            >
              {householdInfo?.householdBudget}
            </p>
          )}
        </div>

        {/* Join Code Section */}
        <div className="flex gap-3 items-center rounded-2xl text-white p-4 bg-green-600 w-full md:w-1/2">
          <h3 className="text-xl">Join Code</h3>
          {isEditing.field === "householdJoinCode" ? (
            <>
              <input
                type="text"
                value={isEditing.value}
                onChange={handleChange}
                className="text-blue-800 rounded px-2 py-1 w-24 bg-white"
              />
              {showSave && (
                <button
                  onClick={updateHousehold}
                  className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-green-100"
                >
                  Save
                </button>
              )}
            </>
          ) : (
            <p
              className="text-lg text-blue-800 cursor-pointer hover:underline"
              onClick={() =>
                handleEditClick("householdJoinCode", householdInfo?.householdJoinCode)
              }
            >
              {householdInfo?.householdJoinCode}
            </p>
          )}
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