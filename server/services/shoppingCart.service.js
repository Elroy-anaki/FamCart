import ShoppingCart from "../models/shoppingCart.model.js"
import Household from "../models/household.model.js"
import Recipe from "../models/recipe.model.js"


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
            cartName: `${oldCart.cartName}`,
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

export const recipeToCart = async (cartId,recipeId, data) => {
    try {
        console.log(cartId)
        console.log(recipeId)
        console.log(data.user)
    

        const recipe = await Recipe.findById(recipeId)
        const recipeIngredients = recipe.ingredients;

        console.log("data.user.payload.householdId", data.user.payload.householdId);
        const household = await Household.findById(data.user.payload.householdId)
        console.log("household", household)

         if (cartId === "new") {
            // Create a new shopping cart with the provided ingredients
             const newCart = await ShoppingCart.create({
                 cartName: recipe.recipeName,
                 cartItems: recipeIngredients.map((ingredient) => ({
                     name: ingredient.name,
                     quantity: ingredient.quantity,
                     unit: ingredient.unit || null,
                     completed: false, // Default to not completed
                 })),
                 cartTotalPrice: 0,  //Default total price
                 cartOwner: data.user.payload._id, // Set cartOwner if needed
                 householdId: data.user.payload.householdId, // Set householdId if needed
             });
             household.householdShoppingCarts.push(newCart._id)
             await household.save()
             return newCart;
         }

        // // Find the shopping cart by ID
         const cart = await ShoppingCart.findById(cartId);
         if (!cart) throw new Error("Cart not found");

         // Update cart items based on the ingredients array
         const updatedCartItems = [...cart.cartItems];

         recipeIngredients.forEach((ingredient) => {
            const existingItemIndex = updatedCartItems.findIndex(
                (item) => item.name === ingredient.name
            );

            if (existingItemIndex !== -1) {
                 // Update the quantity if the ingredient already exists
                 updatedCartItems[existingItemIndex].quantity += ingredient.quantity;
             } else {
                 // Add the ingredient as a new item
                updatedCartItems.push({
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit || null,
                    completed: false, //Default to not completed
                });
             }
         });

         // Save the updated cart items back to the shopping cart
         cart.cartItems = updatedCartItems;
         await cart.save();

         return cart;
    } catch (error) {
        throw error;
    }
};


export const getTotalExpensesToHousehold = async (householdId, query) => {
  try {
    const { month, year } = query;

    if (!month || !year) {
      throw new Error("Missing month or year in query parameters");
    }

    const monthNum = parseInt(month); 
    const yearNum = parseInt(year);

    const completedCarts = await ShoppingCart.find({
      householdId,
      isCompleted: true,
      completedAt: {
        $gte: new Date(yearNum, monthNum, 1),              
        $lt: new Date(yearNum, monthNum + 1, 1),             
      },
    });

    // חישוב סכום כולל
    const totalExpenses = completedCarts.reduce((sum, cart) => {
      return sum + (cart.cartTotalPrice || 0);
    }, 0);

    return totalExpenses
  } catch (error) {
    console.error("Failed to get total expenses:", error);
    throw error;
  }
};
