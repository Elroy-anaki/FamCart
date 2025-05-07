import {createNewHousehold, joinToHousehold, getHouseholdInfoByUserId} from "../services/household.service.js"

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
        const {userId,joinCode} = req.body;
        const result = await joinToHousehold(userId, joinCode);

        res.status(201).json({ok: true, msg:"joined", data: result})
    } catch (error) {
        next(error)
    }
}

export const getHouseholdInfo = async (req, res, next) => {
    try {
        const household = await getHouseholdInfoByUserId(req.params.userId)
        res.status(201).json({ok: true, data: household})
    } catch (error) {
        next(error)
    }
}