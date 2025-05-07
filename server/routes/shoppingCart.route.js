import {Router} from 'express';
import {createShoppingCart, getAllShoppingCartsByHouseholdId, updateItems, getCartById} from "../controllers/shoppingCart.contoller.js"
const router = Router()

router.post(`/`, createShoppingCart)

router.get(`/:householdId/householdId`, getAllShoppingCartsByHouseholdId)

router.put(`/:cartId/items`, updateItems)

router.get(`/:cartId`, getCartById)
export default router