import mongoose, { Schema } from "mongoose";

const ingredientSchema = new Schema({
  name: { type: String, required: true }, // Name of the ingredient
  quantity: { type: Number, required: true }, // Quantity of the ingredient
  unit: { type: String, required: false }, // Unit of measurement (e.g., grams, cups)
}, { _id: false });

const recipeSchema = new Schema({ 
  recipeName: {
    type: String,
    required: true
  },
  ingredients: {
    type: [ingredientSchema],
    required: true,
    default: []
  },
  preparationSteps: {
    type: String,
    required: true 
  },
  image: {
    type: String,
    required: false 
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  linkedHousehold: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Households",
    default: null
  }
}, { timestamps: true });

const Recipe = mongoose.model("Recipes", recipeSchema);

export default Recipe;