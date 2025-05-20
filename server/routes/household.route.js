import {Router} from 'express';
import {createHousehold, joinHousehold, getHouseholdInfo, deleteMember, leaveHousehold, householdDispersion, updateDays, updateBudget} from "../controllers/household.controller.js"

const router = Router();

// Create household
router.post('/', createHousehold)

// Join household
router.post('/join', joinHousehold)

// Get household by id (if there is no return null)
router.get("/:userId", getHouseholdInfo)

// Admin can delete a member
router.delete("/delete/:householdId/:memberId", deleteMember)

// Memeber delete himself
router.delete("/leave/:householdId/:memberId", leaveHousehold)

// Admin can dispersion the household
router.delete("/dispersion/:householdId", householdDispersion)

router.put("/updateDays/:householdId", updateDays)

router.put("/updateBudget/:householdId", updateBudget)
export default router