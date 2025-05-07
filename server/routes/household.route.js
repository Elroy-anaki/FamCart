import {Router} from 'express';
import {createHousehold, joinHousehold} from "../controllers/household.controller.js"

const router = Router();

// Create household
router.post('/', createHousehold)

// Join household
router.post('/join', joinHousehold)

export default router