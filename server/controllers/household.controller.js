import {createNewHousehold, joinToHousehold, getHouseholdInfoByUserId, deleteMemberById, leaveHouseholdByMemberId, householdDispersionByhouseholdId, updateShoppingDays, updateHouseholdBudget} from "../services/household.service.js"

export const createHousehold = async (req, res, next) => {
    try {
        console.log(req.body)
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
        console.log("userId", req.params.userId)
        const household = await getHouseholdInfoByUserId(req.params.userId)
        res.status(201).json({ok: true, data: household})
    } catch (error) {
        next(error)
    }
}
export const deleteMember = async (req, res, next) => {
    try {
        
        await deleteMemberById(req.params.householdId, req.params.memberId)
        res.status(203).json({ok: true})
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export const leaveHousehold = async (req, res, next) => {
    try {
        
        await leaveHouseholdByMemberId(req.params.householdId, req.params.memberId)
        res.status(203).json({ok: true})
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export const householdDispersion = async (req, res, next) => {
    try {
        
        await householdDispersionByhouseholdId(req.params.householdId)
        res.status(203).json({ok: true})
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export const updateDays = async (req, res, next) => {
    try {
        
        await updateShoppingDays(req.params.householdId, req.body.days)
        res.status(203).json({ok: true})
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export const updateBudget = async (req, res, next) => {
    try {
        
        await updateHouseholdBudget(req.params.householdId, req.body)
        res.status(203).json({ok: true})
    } catch (error) {
        console.log(error)
        next(error)
    }
}