import { useContext, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HouseholdContext } from "../../../context/HouseholdContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifyError, notifySuccess } from "../../../lib/Toasts";

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function HouseholdShoppingDays({ shoppingDays }) {
    const { householdInfo } = useContext(HouseholdContext);
    const [isSaveOpen, setIsSaveOpen] = useState(false)
    const queryClient = useQueryClient();
    const [updatedShoppingDays, setUpdatedShoppingDays] = useState(shoppingDays || []);

    const availableDays = allDays.filter(day => !updatedShoppingDays.includes(day));

    const handleAddDay = (e) => {
        setIsSaveOpen(true)
        const selectedDay = e.target.value;
        if (selectedDay && !updatedShoppingDays.includes(selectedDay)) {
            setUpdatedShoppingDays([...updatedShoppingDays, selectedDay]);
        }
    };

    const handleRemoveDay = (dayToRemove) => {
        setUpdatedShoppingDays(updatedShoppingDays.filter(day => day !== dayToRemove));
        setIsSaveOpen(true)

    };

    const resetDaysAsDB = () => {
        setUpdatedShoppingDays(shoppingDays)
        setIsSaveOpen(false)
    }

    const {mutate: updateDays} = useMutation({
        mutationKey: ["updateShoppingDays"],
        mutationFn: async () => ((await axios.put(`/households/updateDays/${householdInfo._id}`, {days: updatedShoppingDays})).data),
        onSuccess: () => {
            notifySuccess("Update days succesfully")
            queryClient.invalidateQueries({queryKey:['getHouseholdInfo']})
            setIsSaveOpen(false)
        },
        onError:() => {
            notifyError("Update days failed")
        }

    })

    

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 bg-slate-100 rounded-xl px-4 py-4">
                {updatedShoppingDays.map((day) => (
                    <div key={day} className="flex items-center gap-2 bg-slate-200 px-3 py-1 rounded-lg">
                        <p className="text-black">{day}</p>
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
              {isSaveOpen &&  <div className="flex justify-center gap-3">
                <button onClick={updateDays} className="self-start bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl">
                Save
            </button>
                <button onClick={resetDaysAsDB} className="self-start bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl">
                Reset
            </button>
                </div>
               }
            </div>

            
        </div>
    );
}
