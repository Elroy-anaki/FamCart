import Household from "../models/household.model.js"
import User from "../models/user.model.js"


export const createNewHousehold = async (newHouseholdInput) => {
    try {
        const newHousehold = await Household.create({
            householdName: newHouseholdInput.householdName,
            householdBudget: newHouseholdInput.householdBudget,
            householdOwner: newHouseholdInput.householdOwner,
            householdShoppingDays: newHouseholdInput.householdShoppingDays,
            householdMembers: [newHouseholdInput.householdOwner]
        })
        let user = await User.findById(newHouseholdInput.householdOwner);
        user.householdId = newHousehold._id
        await user.save()
        return newHousehold
    } catch (error) {
        throw error
    }
}

export const joinToHousehold = async (userId, joinCode) => {
    try {
        let household = await Household.find({householdJoinCode: joinCode});
        household = household[0]

        if (!household) {
            throw new Error('Household not found');
        }
        if(household.householdJoinCode !== joinCode) {
            throw new Error('Invalid join code');
        }
        if(household.householdOwner === userId) {
            throw new Error('You are the admin');
        }
        // Check if the user already member in this household
        if (household.householdMembers.includes(userId)) {
            throw new Error('You already member in this household');
            
        }
        household.householdMembers.push(userId);
        await household.save();

        let user = await User.findById(userId);
        user.householdId = household._id
        await user.save()
       return household
    } catch (error) {
        throw error;
    }
};


export const getHouseholdInfoByUserId = async(userId) => {
    try {
        const user = await User.findById(userId)
        if(!user.householdId) {
            return null
        } 
        const householdByUserId = await Household.findById(user.householdId)
    .populate("householdMembers")
    .populate("householdShoppingCarts")
    .populate("householdOwner");
        return householdByUserId
    } catch (error) {
        throw error
    }
}

export const deleteMemberById = async (housholdId, memberId) => {
    try {
        const household = await Household.findById(housholdId)
        const updatedMembers = household.householdMembers.filter(
            (member) => member.toString() !== memberId.toString()
        );
                household.householdMembers = updatedMembers
        await household.save()
        await User.findByIdAndUpdate(memberId, {householdId: null})

    } catch (error) {
        throw error
    }
}
export const leaveHouseholdByMemberId = async (housholdId, memberId) => {
    try {
        
        const household = await Household.findById(housholdId)
        const updatedMembers = household.householdMembers.filter(
            (member) => member.toString() !== memberId.toString()
        );
                household.householdMembers = updatedMembers
        await household.save()
        await User.findByIdAndUpdate(memberId, {householdId: null})

    } catch (error) {
        throw error
    }
}
export const householdDispersionByhouseholdId = async (housholdId) => {
    try {
        
        const household = await Household.findById(housholdId)
        const members = household.householdMembers
        for(const member of members) {
            await User.findByIdAndUpdate(member, {householdId: null})
        }
        // in the future do this operation also on carts
        await household.deleteOne()

    } catch (error) {
        throw error
    }
}
export const updateShoppingDays = async (housholdId, updatedDays) => {
    try {        
        const household = await Household.findById(housholdId)
        household.householdShoppingDays = updatedDays;
        await household.save()

    } catch (error) {
        throw error
    }
}
export const updateHouseholdBudget = async (housholdId, newBudget) => {
    try {
        
        const household = await Household.findById(housholdId, newBudget)
        household.householdBudget = newBudget;
        await household.save()

    } catch (error) {
        throw error
    }
}