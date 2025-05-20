
import {createNewShoppingCart, getShoppingCartsByHouseholdId, updateCartItems, getCart, deleteCartFromHousehold} from "../services/shoppingCart.service.js"

export const createShoppingCart = async (req, res, next ) => {
    try {
        console.log("dndsd")
        const newShoppingCart = await createNewShoppingCart(req.body)
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

