import mongoose, { Schema, model } from "mongoose";

const shoppingCartSchema = new Schema({ 
    cartName: {
        type: String,
        required: true
    },
    cartItems: {
        type: [{name: String, quantity: Number, completed: Boolean}],
        required: true,
        default: []
    },
    cartTotalPrice: {
        type: Number,
        required: true,
        default: 0
    },

    cartOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Households",
        default: null
    }
}, { timestamps: true });

const ShoppingCart = mongoose.model("ShoppingCarts", shoppingCartSchema);

export default ShoppingCart;
