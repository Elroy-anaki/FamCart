import ShoppingCart from "../models/shoppingCart.model.js"
import Household from "../models/household.model.js"


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
export const deleteCartFromHousehold = async (householdId, cartId) => {
    try {
      const cart = await ShoppingCart.findById(cartId);
      if (!cart) throw new Error("Cart not found");
  
      await cart.deleteOne();
  
      const household = await Household.findById(householdId);
      if (!household) throw new Error("Household not found");
  
      household.householdShoppingCarts = household.householdShoppingCarts.filter(
        (id) => id.toString() !== cartId.toString()
      );
  
      await household.save();
  
    } catch (error) {
      throw error;
    }
  };
  