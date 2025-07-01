import { AuthContext } from "../../../context/AuthContext";
import HouseholdForm from "./HouseholdForm";
import React, { useContext } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../lib/Toasts";
import { useQueryClient } from "@tanstack/react-query";


export default function CreateNewHousehold(){

    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const onSubmit = async(values) => {
        const newHousehold = {...values, householdOwner: user._id}
        try {
            const {data} = await axios.post("/households", newHousehold)
            console.log(data)
            notifySuccess("משק בית נוצר בהצלחה")
            queryClient.invalidateQueries({queryKey: ["verifyToken", "getHouseholdInfo" ]})
            navigate("/household")

        } catch (error) {
            console.log(error)
            notifyError("יצירת משק בית נכשלה")
        }

        
    }
    return (
        <>
        <HouseholdForm onSubmit={onSubmit}/>
        </>
    )
}