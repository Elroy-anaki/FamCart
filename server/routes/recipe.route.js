import { Router } from "express";
import upload from "../config/multer.config.js";
import { createRecipe, getRecipesByHousehold, getRecipesByUser, getRecipeById, updateAllRecipe, deleteRecpieById } from "../controllers/recipe.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";

const recipeRouter = Router()

// Middleware for auth
recipeRouter.use(verifyToken)

// Create recipe
recipeRouter.post("/", upload.single("image"), createRecipe)

// Get all recipes related to a specific household
recipeRouter.get("/household/:householdId", getRecipesByHousehold)

// Get all recipe related to a specific user
recipeRouter.get("/users/:userId", getRecipesByUser)

// Get a specific recipe (by id)
recipeRouter.get("/:recipeId", getRecipeById)

// Change all recipe in ONE request
recipeRouter.put("/update-all-recipe/:recipeId", updateAllRecipe)

// Delete a specific recipe (by id)
recipeRouter.delete("/:recipeId", deleteRecpieById)


export default recipeRouter