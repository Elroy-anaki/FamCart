import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: false },
  completed: { type: Boolean, default: false }
}, { _id: false });

const shoppingCartSchema = new Schema({ 
  cartName: {
    type: String,
    required: true
  },
  cartItems: {
    type: [cartItemSchema],
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
