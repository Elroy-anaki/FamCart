import {createNewHousehold, joinToHousehold} from "../services/household.service.js"

export const createHousehold = async (req, res, next) => {
    try {
        const newHousehold = await createNewHousehold(req.body)
        res.status(201).json({ok: true, data: newHousehold})
    } catch (error) {
        next(error)
    }
    
}

export const joinHousehold = async (req, res, next) => {
    try {
        const {userId, householdId, joinCode} = req.body;
        const result = await joinToHousehold(userId, householdId, joinCode);

        res.status(201).json({ok: true, msg:"joined", data: result})
    } catch (error) {
        next(error)
    }
}