import Household from "../models/household.model.js"



export const createNewHousehold = async (newHouseholdInput) => {
    try {
        const newHousehold = await Household.create({
            householdName: newHouseholdInput.householdName,
            householdBudget: newHouseholdInput.householdBudget,
            householdOwner: newHouseholdInput.householdOwner,
            householdShoppingDays: newHouseholdInput.householdShoppingDays,
            householdMembers: [newHouseholdInput.householdOwner]
        })
        return newHousehold
    } catch (error) {
        throw error
    }
}

export const joinToHousehold = async (userId, householdId, joinCode) => {
    try {
        const household = await Household.findById(householdId);
        console.log(household)
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
        if (!household.householdMembers.includes(userId)) {
            household.householdMembers.push(userId);
            await household.save();
        }
       return household
    } catch (error) {
        console.error('Error joining household:', error);
        throw error;
    }
};
