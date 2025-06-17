import ShoppingCart from "../models/shoppingCart.model.js"
import Household from "../models/household.model.js"


export const createNewShoppingCart = async(shoppingCartInput) => {
    try {
    
        const newShoppingCart = await ShoppingCart.create(shoppingCartInput)
        const household = await Household.findById(shoppingCartInput.householdId)
        household.householdShoppingCarts.push(newShoppingCart._id)
        await household.save()
        return newShoppingCart
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getShoppingCartsByHouseholdId = async (householdId) => {
    try {
        const shoppingCarts = await ShoppingCart.find({householdId, isCompleted: false})
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
export const markAsCompleted = async (cartId, dataToUpdate) => {
    try {
        console.log(dataToUpdate)
        const cart = await ShoppingCart.findById(cartId);
        cart.cartItems = cart.cartItems.map((item) => ({...item, completed: true }))
        cart.isCompleted = true,
        cart.cartTotalPrice = dataToUpdate.cartTotalPrice
        await cart.save()
  
    } catch (error) {
      throw error;
    }
  };
  
export const getCartsHistoryByHouseholdId = async (householdId) => {
    try {
        const cartsHistory = await ShoppingCart.find({householdId: householdId, isCompleted:true})
        const totalPrice = cartsHistory.reduce((acc, cart) => acc + cart.cartTotalPrice, 0);
        return { cartsHistory, totalPrice };

    } catch (error) {
      throw error;
    }
  };
  
  export const reopenCart = async (cartId) => {
    try {
        // Find the old cart
        const oldCart = await ShoppingCart.findById(cartId);
        if (!oldCart) throw new Error("Cart not found");

        // Reset completed status for all items
        const newCartItems = oldCart.cartItems.map((item) => ({
            ...item,
            completed: false,
        }));

        // Create a new cart based on the old cart
        const newCart = await ShoppingCart.create({
            cartName: `${oldCart.cartName} (Reopened)`,
            cartItems: newCartItems,
            cartTotalPrice: 0, // Reset total price
            cartOwner: oldCart.cartOwner,
            householdId: oldCart.householdId,
        });

        return newCart;
    } catch (error) {
        throw error;
    }
};