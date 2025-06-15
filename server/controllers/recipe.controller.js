import { createNewRecipe, getRecipes, findRecipeById, updateRecipe, deleteRecpie} from "../services/recipe.service.js";



export const createRecipe = async (req, res, next) => {
    try {
        console.log(req.file)
        console.log(req.body)
        await createNewRecipe(req.file, req.body);
        res.status(200).json({ok: true})
    } catch (error) {
        next(error)
    }
}

export const getRecipesByHousehold = async (req, res, next) => {
    try {
        console.log(req.params.householdId);
        
        const recipes = await getRecipes({linkedHousehold: req.params.householdId});
        res.status(200).json({ok: true, data: recipes})
    } catch (error) {
        next(error)
    }
}

export const getRecipesByUser = async (req, res, next) => {
    try {
        console.log(req.params.userId);
        
        const recipes = await getRecipes({createdBy: req.params.userId});
        res.status(200).json({ok: true, data: recipes})
    } catch (error) {
        next(error)
    }
}
export const getRecipeById = async (req, res, next) => {
    try {
        console.log(req.params.recipeId);
        
        const recipe = await findRecipeById(req.params.recipeId);
        res.status(200).json({ok: true, data: recipe})
    } catch (error) {
        next(error)
    }
}

export const updateAllRecipe = async (req, res, next) => {
    try {
        console.log(req.params.recipeId);
        
        
        const recipe = await updateRecipe(req.params.recipeId, req.body);
        res.status(200).json({ok: true, data: recipe})
    } catch (error) {
        next(error)
    }
}

export const deleteRecpieById = async (req, res, next) => {
    try {
        console.log(req.params)
        await deleteRecpie(req.params.recipeId);
        res.status(200).json({ok: true})
    } catch (error) {
        next(error)
    }
}


