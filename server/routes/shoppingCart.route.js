import {Router} from 'express';
import {createShoppingCart, getAllShoppingCartsByHouseholdId, updateItems, getCartById, deleteCart, markCartAsCompleted, getCartsHistory, reopen} from "../controllers/shoppingCart.contoller.js"
const router = Router()

router.post(`/`, createShoppingCart)

router.get(`/:householdId/householdId/active`, getAllShoppingCartsByHouseholdId)

router.put(`/:cartId/items`, updateItems)

router.get(`/:cartId`, getCartById)

router.delete("/:householdId/:cartId", deleteCart)

router.put("/:cartId/completed", markCartAsCompleted)

router.get("/:householdId/history", getCartsHistory)

router.post("/:cartId/reopen", reopen)


export default router