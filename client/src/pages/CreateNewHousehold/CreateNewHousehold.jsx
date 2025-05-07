import { AuthContext } from "../../context/AuthContext";
import HouseholdForm from "./HouseholdForm";
import React, { useContext } from "react";
import axios from 'axios'
import { notifyError, notifySuccess } from "../../lib/Toasts";

export default function CreateNewHousehold(){
    const {user} = useContext(AuthContext)
    const onSubmit = async(values) => {
        const newHousehold = {...values, householdOwner: user._id}
        try {
            const {data} = await axios.post("/households", newHousehold)
            console.log(data)
            notifySuccess(`Create a new houshold. Join code is ${data.data.householdJoinCode}`)
        } catch (error) {
            console.log(error)
            notifyError("Failed creating a new household")
        }

        
    }
    return (
        <>
        <HouseholdForm onSubmit={onSubmit}/>
        </>
    )
}