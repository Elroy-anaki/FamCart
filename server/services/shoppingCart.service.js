import ShoppingCart from "../models/shoppingCart.model.js"


export const createNewShoppingCart = async(shoppingCartInput) => {
    try {
        const newShoppingCart = await ShoppingCart.create(shoppingCartInput)
        return newShoppingCart
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getShoppingCartsByHouseholdId = async (householdId) => {
    try {
        const shoppingCarts = await ShoppingCart.find({householdId})
        return shoppingCarts 
    } catch (error) {
        throw error
    }
}

export const updateCartItems = async (cartId, items) => {
    try {console.log(items)
        const updatedCart = await ShoppingCart.findById(cartId)
        updatedCart.cartItems = items;
       await updatedCart.save()
       return updatedCart
    } catch (error) {
        throw error
    }
}
export const getCart = async (cartId) => {
    try {
        const cart = await ShoppingCart.findById(cartId)
       return cart
    } catch (error) {
        throw error
    }
}