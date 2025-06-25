import {Router} from 'express';
import {createShoppingCart, getAllShoppingCartsByHouseholdId, updateItems, getCartById, deleteCart, markCartAsCompleted, getCartsHistory, reopen, addRecipeToCart, getTotalExpenses} from "../controllers/shoppingCart.contoller.js"
import verifyToken from '../middlewares/verifyToken.middleware.js';

const shoppingCartRouter = Router()

// Middleware for auth
shoppingCartRouter.use(verifyToken)

// Create a cart
shoppingCartRouter.post(`/`, createShoppingCart)

// Get all active carts in a specific household
shoppingCartRouter.get(`/:householdId/householdId/active`, getAllShoppingCartsByHouseholdId)

// Change the items in a specific cart in ONE request
shoppingCartRouter.put(`/:cartId/items`, updateItems)

// Get a specific cart (by id)
shoppingCartRouter.get(`/:cartId`, getCartById)

// Delete a specific cart (by id)
shoppingCartRouter.delete("/:householdId/:cartId", deleteCart)

// Mark cart as completed
shoppingCartRouter.put("/:cartId/completed", markCartAsCompleted)

// Get all completed carts (history)
shoppingCartRouter.get("/:householdId/history", getCartsHistory)

// Reopen a completed cart
shoppingCartRouter.post("/:cartId/reopen", reopen)

// Add recipe to a cart
shoppingCartRouter.put("/:cartId/:recipeId/addRecipeToCart", addRecipeToCart)

// Get Total expenses 
shoppingCartRouter.get("/total-expenses/:householdId", getTotalExpenses)


export default shoppingCartRouter