import { Router } from "express";
import upload from "../config/multer.config.js";
import { createRecipe, getRecipesByHousehold, getRecipesByUser, getRecipeById, updateAllRecipe, deleteRecpieById } from "../controllers/recipe.controller.js";

const recipeRouter = Router()

recipeRouter.post("/", upload.single("image"), createRecipe)

recipeRouter.get("/household/:householdId", getRecipesByHousehold)


recipeRouter.get("/users/:userId", getRecipesByUser)

recipeRouter.get("/:recipeId", getRecipeById)

recipeRouter.put("/update-all-recipe/:recipeId", updateAllRecipe)

recipeRouter.delete("/:recipeId", deleteRecpieById)

export default recipeRouter