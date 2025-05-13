import {Router} from 'express';
import {createHousehold, joinHousehold, getHouseholdInfo, deleteMember} from "../controllers/household.controller.js"

const router = Router();

// Create household
router.post('/', createHousehold)

// Join household
router.post('/join', joinHousehold)

// Get household by id (if there is no return null)
router.get("/:userId", getHouseholdInfo)


router.delete("/delete/:householdId/:memberId", deleteMember)

export default router