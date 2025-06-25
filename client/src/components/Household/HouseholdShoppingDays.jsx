
import { useContext, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HouseholdContext } from "../../context/HouseholdContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { allDays } from "../../constants/index";

export function HouseholdShoppingDays({ shoppingDays }) {
    // Contexts
    const { householdInfo } = useContext(HouseholdContext);

    // Hooks
    const queryClient = useQueryClient();

    // States
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [updatedShoppingDays, setUpdatedShoppingDays] = useState(shoppingDays || []);

    // Current day of the week
    const currentDay = allDays[new Date().getDay()];

    const availableDays = allDays.filter(day => !updatedShoppingDays.includes(day));

    // Utils
    const handleAddDay = (e) => {
        setIsSaveOpen(true);
        const selectedDay = e.target.value;
        if (selectedDay && !updatedShoppingDays.includes(selectedDay)) {
            setUpdatedShoppingDays([...updatedShoppingDays, selectedDay]);
        }
    };

    const handleRemoveDay = (dayToRemove) => {
        setUpdatedShoppingDays(updatedShoppingDays.filter(day => day !== dayToRemove));
        setIsSaveOpen(true);
    };

    const resetDaysAsDB = () => {
        setUpdatedShoppingDays(shoppingDays);
        setIsSaveOpen(false);
    };

    // Queries
    const { mutate: updateDays } = useMutation({
        mutationKey: ["updateShoppingDays"],
        mutationFn: async () => (
            (await axios.put(`/households/updateDays/${householdInfo._id}`, { days: updatedShoppingDays })).data
        ),
        onSuccess: () => {
            notifySuccess("Update days successfully");
            queryClient.invalidateQueries({ queryKey: ['getHouseholdInfo'] });
            setIsSaveOpen(false);
        },
        onError: () => {
            notifyError("Update days failed");
        }
    });

    return (
        <div className="flex flex-col gap-4">
             {updatedShoppingDays.includes(currentDay) && (
      <p className="text-green-600 font-semibold text-lg">Today is a shopping day</p>
    )}
            <div className="flex flex-wrap gap-3 bg-slate-100 rounded-xl px-4 py-4">
            
                {updatedShoppingDays.map((day) => (
                    <div
                        key={day}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                            day === currentDay ? "bg-green-100" : "bg-slate-200"
                        }`}
                    >
                        <p className={`text-black ${day === currentDay ? "text-green-600 font-semibold" : ""}`}>
                            {day}
                        </p>
                        <button onClick={() => handleRemoveDay(day)} className="hover:bg-white p-1 rounded-lg">
                            <FaRegTrashAlt color="red" />
                        </button>
                    </div>
                ))}

                <select onChange={handleAddDay} className="rounded-md px-2 py-1 bg-white">
                    <option value="">Add day</option>
                    {availableDays.map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                {isSaveOpen && (
                    <div className="flex justify-center gap-3 mt-2">
                        <button onClick={updateDays} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl">
                            Save
                        </button>
                        <button onClick={resetDaysAsDB} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl">
                            Reset
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
