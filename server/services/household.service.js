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
        console.log("owner", newHouseholdInput.householdOwner)
        let user = await User.findById(newHouseholdInput.householdOwner);
        console.log(user)
        console.log("newHousehold._id", newHousehold._id)
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
        console.error('Error joining household:', error);
        throw error;
    }
};


export const getHouseholdInfoByUserId = async(userId) => {
    try {
        const user = await User.findById(userId)
        console.log("user -----", user)
        if(!user.householdId) {
            console.log("noooooooo")
            return null
        } 
        const householdByUserId = await Household.findById(user.householdId)
        return householdByUserId
    } catch (error) {
        throw error
    }
}