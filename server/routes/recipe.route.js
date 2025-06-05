import { Router } from "express";
import upload from "../config/multer.config.js";
import { createRecipe, getRecipesByHousehold, getRecipesByUser } from "../controllers/recipe.controller.js";

const recipeRouter = Router()

recipeRouter.post("/", upload.single("image"), createRecipe)

recipeRouter.get("/household/:householdId", getRecipesByHousehold)

recipeRouter.get("/users/:userId", getRecipesByUser)

export default recipeRouter