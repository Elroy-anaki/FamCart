
import {createNewShoppingCart, getShoppingCartsByHouseholdId, updateCartItems, getCart, deleteCartFromHousehold, markAsCompleted,getCartsHistoryByHouseholdId, reopenCart, recipeToCart} from "../services/shoppingCart.service.js"

export const createShoppingCart = async (req, res, next ) => {
    try {
        const newShoppingCart = await createNewShoppingCart(req.body, req.params.householdId)
        res.status(201).json({ok: true, data: newShoppingCart})
    } catch (error) {
        next(error)
        
    }
}
export const getAllShoppingCartsByHouseholdId = async(req, res, next) => {
    try {

        const shoppingCarts = await getShoppingCartsByHouseholdId(req.params.householdId)
        res.status(200).json({ok: true, data: shoppingCarts})
    } catch (error) {
        next(error)
    }
}

export const updateItems = async(req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.params.cartId, req.body.items)
        const updatedCart = await updateCartItems(req.params.cartId, req.body.cartItems)
        res.status(203).json({ok: true, data: updatedCart})
    } catch (error) {
        next(error)
    }
}
export const getCartById = async(req, res, next) => {
    try {
        const cart = await getCart(req.params.cartId)
        res.status(203).json({ok: true, data: cart})
    } catch (error) {
        next(error)
    }
}
export const deleteCart = async(req, res, next) => {
    try {
        console.log(req.params.cartId)
        console.log(req.params.householdId)
        const cart = await deleteCartFromHousehold(req.params.householdId, req.params.cartId)
        res.status(203).json({ok: true, data: cart})
    } catch (error) {
        next(error)
    }
}
export const markCartAsCompleted = async(req, res, next) => {
    try {
        console.log(req.params.cartId)
        console.log(req.body);
        
        await markAsCompleted(req.params.cartId, req.body)
        res.status(203).json({ok: true})
    } catch (error) {
        next(error)
    }
}
export const getCartsHistory = async(req, res, next) => {
    try {
        console.log(req.params.householdId);
                
        const cartsHistory = await getCartsHistoryByHouseholdId(req.params.householdId)
        res.status(203).json({ok: true, data: cartsHistory})
    } catch (error) {
        next(error)
    }
}

export const reopen = async(req, res, next) => {
    try {
        console.log(req.params.cartId);
                
        const cartsHistory = await reopenCart(req.params.cartId)
        res.status(203).json({ok: true, data: cartsHistory})
    } catch (error) {
        next(error)
    }
}

export const addRecipeToCart = async(req, res, next) => {
    try {
        console.log(req.body);

        await recipeToCart(req.params.cartId, req.body)
        res.status(203).json({ok: true, user: req.body})
    } catch (error) {
        next(error)
    }
}

