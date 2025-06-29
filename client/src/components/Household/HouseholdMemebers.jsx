import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HouseholdContext } from "../../context/HouseholdContext";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { AuthContext } from "../../context/AuthContext";


export function HouseholdMembers({ members, owner }) {

    // Contexts
    const { householdInfo } = useContext(HouseholdContext)
    const { user } = useContext(AuthContext)

    // Hooks
    const queryClient = useQueryClient()

    // Queries
    const { mutate: deleteMember } = useMutation({
        mutationKey: ["deleteMember"],
        mutationFn: async (memberId) => {
            return ((await axios.delete(`/households/delete/${householdInfo._id}/${memberId}`)).data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getHouseholdInfo"] })
            notifySuccess("Deleted member succesfully")
        },
        onError: () => {
            notifyError("Deleting member failed")
        }
    })

    const { mutate: leaveHousehold } = useMutation({
        mutationKey: ["leaveHousehold"],
        mutationFn: async () => await axios.delete(`/households/leave/${householdInfo._id}/${user._id}`),
        onSuccess: () => {
            notifySuccess("Bye Bye...")
            queryClient.invalidateQueries({ queryKey: ["getHouseholdInfo"] })
        },
        onError: () => {
            notifyError("Leaving household failed")

        }
    })
    const {mutate: householdDispersion} = useMutation({
        mutationKey:["householdDispersion"],
        mutationFn: async () => await axios.delete(`/households/dispersion/${householdInfo._id}`),
        onSuccess: () => {
            notifySuccess("Household Dispersion succeeded")
            queryClient.invalidateQueries({ queryKey: ["getHouseholdInfo"] })
        },
        onError: () => {
            notifyError("Household Dispersion failed")

        }
    })

    return (
        <div className="bg-gradient-to-b from-blue-50 to-green-50 p-6 rounded-xl shadow-lg w-full mx-auto">

            <h2 className="text-2xl font-bold text-center text-green-800 mb-4">Members</h2>
            <div className="flex flex-col gap-3">
                {members?.map((member) => {
                    const isOwner = member._id === owner._id;
                    const isUserOwner = user._id === owner._id;
                    const isMemberNotOwner = member._id !== owner._id;

                    return (
                        <div
                            key={member._id}
                            className={`p-3 rounded-lg text-white shadow-md transition-all duration-200 flex justify-between items-center
                                ${isOwner ? 'bg-blue-600' : 'bg-green-600'}`}
                        >
                            <p className="text-lg font-medium">{member.userName}</p>
                            <div className="flex items-center gap-2">
                                {isOwner && (
                                    <p className="text-sm text-blue-200 font-semibold">Owner</p>
                                )}
                                {isUserOwner && isMemberNotOwner && (
                                    <button onClick={() => deleteMember(member._id)} className="cursor-pointer rounded-lg p-2 hover:bg-white">
                                        <FaRegTrashAlt color="red" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {user?._id !== owner?._id ? (<button onClick={leaveHousehold} className="bg-red-600  p-3 cursor-pointer text-center hover:bg-red-500 rounded-lg text-white shadow-md transition-all duration-200 ">Leave</button>)
                    : (<button onClick={householdDispersion} className="bg-red-600  p-3 cursor-pointer text-center hover:bg-red-500 rounded-lg text-white shadow-md transition-all duration-200 ">Disperation</button>)}
            </div>
        </div>
    );
}
