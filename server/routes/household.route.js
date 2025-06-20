import {Router} from 'express';
import {createHousehold, joinHousehold, getHouseholdInfo, deleteMember, leaveHousehold, householdDispersion, updateDays, updateBudget, changeJoinCode} from "../controllers/household.controller.js"
import verifyToken from '../middlewares/verifyToken.middleware.js';


const householdRouter = Router();

// Middleware for auth
householdRouter.use(verifyToken)

// Create household
householdRouter.post('/', createHousehold)

// Join household
householdRouter.post('/join', joinHousehold)

// Get household by id (if there is no return null)
householdRouter.get("/:userId", getHouseholdInfo)

// Admin can delete a member
householdRouter.delete("/delete/:householdId/:memberId", deleteMember)

// Memeber delete himself
householdRouter.delete("/leave/:householdId/:memberId", leaveHousehold)

// Admin can dispersion the household
householdRouter.delete("/dispersion/:householdId", householdDispersion)

// Memeber can change the shopping days in the household
householdRouter.put("/updateDays/:householdId", updateDays)

// Memeber can change the budget in the household
householdRouter.put("/update/:householdId", updateBudget)

// Memeber can change the join-code in the household
householdRouter.put("/change-join-code/:householdId", changeJoinCode)



export default householdRouter