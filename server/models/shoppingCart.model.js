import mongoose, { Schema, model } from "mongoose";

const shoppingCartSchema = new Schema({ 
    cartName: {
        type: String,
        required: true
    },
    cartItems: {
        type: [String],
        required: true,
        default: []
    },
    cartTotalPrice: {
        type: Number,
        required: true
    },
    cartOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
}, { timestamps: true });

const ShoppingCart = mongoose.model("ShoppingCarts", shoppingCartSchema);

export default ShoppingCart;
