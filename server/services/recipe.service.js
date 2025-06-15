import Recipe from "../models/recipe.model.js"
import cloudinary from '../config/cloudinary.config.js';


export const createNewRecipe = async (imageFile, recipeDetails) => {
    try {
        console.log("imageFile", imageFile)
        if (imageFile) {
            console.log("There is a file")
            const { secure_url } = await cloudinary.uploader.upload(imageFile.path);
            recipeDetails.image = secure_url;
          }
          console.log("recipeDetails", recipeDetails)
          await Recipe.create(recipeDetails)
    } catch (error) {
        throw error
    }
}
export const getRecipes = async (filter) => {
    try {
        const recipes = Recipe.find(filter).populate("createdBy")
        return recipes || []
    } catch (error) {
        throw error
    }
}
export const findRecipeById = async (recipeId) => {
    try {
        const recipe = Recipe.findById(recipeId).populate("createdBy")
        return recipe || null
    } catch (error) {
        throw error
    }
}
export const updateRecipe = async (recipeId, dataToUpdate) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate)
        console.log(recipe)
        return recipe || null
    } catch (error) {
        throw error
    }
}
export const deleteRecpie = async (recipeId) => {
    try {
        console.log(recipeId)
        await Recipe.findByIdAndDelete(recipeId)
    } catch (error) {
        throw error
    }
}