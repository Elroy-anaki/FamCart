import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { unitOptions } from "../../constants/index";
import { HouseholdContext } from "../../context/HouseholdContext";

const RecipePage = () => {

  // Context
  const { householdInfo } = useContext(HouseholdContext)

  // Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [showCartsSelect, setshowCartSelect] = useState(false)
  const[ingredientsToAdd, setIngredientsToAdd] = useState([])
  const [editedRecipe, setEditedRecipe] = useState({
    recipeName: "",
    image: "",
    ingredients: [],
    preparationSteps: [],
    preparationTime: ""
  });


  // Queries
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ["getRecipe", id],
    queryFn: async () => {
      const response = await axios.get(`/recipes/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (recipe) {
      setEditedRecipe({
        recipeName: recipe.recipeName || "",
        image: recipe.image || "",
        ingredients: recipe.ingredients || [],
        preparationSteps: recipe.preparationSteps || [],
        preparationTime: recipe.preparationTime || ""
      });
    }
  }, [recipe]);

  const { mutate: saveRecipe, isLoading: isSaving } = useMutation({
    mutationFn: async (updatedRecipe) => {
      await axios.put(`/recipes/update-all-recipe/${id}`, updatedRecipe);
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["getRecipe", id] });
      notifySuccess("Recipe updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating recipe:", error);
      notifyError("Failed to update recipe. Please try again.");
    },
  });

  const { mutate: deleteRecipe, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/recipes/${id}`);
    },
    onSuccess: () => {
      notifySuccess("Recipe deleted successfully!");
      navigate("/household/recipes");
    },
    onError: (error) => {
      console.error("Error deleting recipe:", error);
      notifyError("Failed to delete recipe. Please try again.");
    },
  });

  const {mutate: addRecipeToCart} = useMutation({
    mutationKey:["addRecipeToCart"],
    mutationFn: async(cartId) => (
      await axios.put(`/shoppingCart/${cartId}/addRecipeToCart`, {ingredients: ingredientsToAdd, householdId: householdInfo._id, recipeName: recipe.recipeName})
    ),
    onSuccess: () => notifySuccess("Add Recipe To a Cart!"),
    onError: () => notifyError("Failed Adding Recipe To a Cart!")
  })

  const handleCancel = () => {
    if (recipe) {
      setEditedRecipe({
        recipeName: recipe.recipeName || "",
        image: recipe.image || "",
        ingredients: recipe.ingredients || [],
        preparationSteps: recipe.preparationSteps || [],
        preparationTime: recipe.preparationTime || ""
      });
    }
    setIsEditing(false);
  };

  if (isLoading) return <p className="text-center text-gray-500 p-4">Loading recipe...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Failed to load recipe. Please try again later.</p>;

  return (
    <div className="w-full sm:w-3/4 mx-auto px-3 py-6 flex flex-col justify-center items-center">
      <div className="flex flex-col sm:flex-row w-full justify-center sm:justify-center items-stretch sm:items-center gap-3 mb-6">
        <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" disabled={isEditing || isDeleting}>Edit</button>
        <button onClick={() => deleteRecipe()} className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</button>
        <button onClick={() => {setshowCartSelect(!showCartsSelect); console.log(householdInfo)}} className="w-full sm:w-auto bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">Add to cart</button>
        {showCartsSelect && (
          <select className="bg-gray-600 text-white px-4 py-2 rounded-md" onChange={(e) =>{ console.log(recipe.ingredients, e.target.value);setIngredientsToAdd(recipe.ingredients); addRecipeToCart(e.target.value)}}>
            <option value=" ">choose</option>
            <option value="1">new</option>
            {householdInfo.householdShoppingCarts.map((cart, index) => (
              <option  value={cart._id}>{cart.cartName}</option>
            ))}
          </select>
        )}
      </div>

      <div className="w-full sm:w-3/4 bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="mb-6">
          {isEditing ? (
            <input type="text" value={editedRecipe.recipeName} onChange={(e) => setEditedRecipe(prev => ({ ...prev, recipeName: e.target.value }))} className="w-full text-xl sm:text-3xl font-bold text-center text-gray-800 border rounded-md px-4 py-2" placeholder="Enter recipe name" />
          ) : (
            <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 break-words">{editedRecipe.recipeName || "Recipe Name"}</h1>
          )}
        </div>

        <div className="mb-6">
          {isEditing ? (
            <input type="file" onChange={(e) => setEditedRecipe(prev => ({ ...prev, image: e.target.files[0] }))} className="w-full border rounded-md px-4 py-2" accept="image/*" />
          ) : (
            <div className="w-full h-56 sm:h-64 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
              {editedRecipe.image ? (
                <img src={editedRecipe.image} alt={editedRecipe.recipeName} className="w-full h-full object-cover" />
              ) : (
                <p className="text-gray-500 text-sm">No Image Available</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Ingredients</label>
          <div className="space-y-2">
            {editedRecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex flex-wrap sm:flex-row gap-2 bg-gray-50 rounded-md p-3 items-center">
                <input type="text" placeholder="Name" value={ingredient.name || ""} onChange={(e) => { const updated = [...editedRecipe.ingredients]; updated[index].name = e.target.value; setEditedRecipe(prev => ({ ...prev, ingredients: updated })); }} className="flex-1 border rounded-md px-3 py-2" disabled={!isEditing} />
                <input type="number" placeholder="Qty" value={ingredient.quantity || ""} onChange={(e) => { const updated = [...editedRecipe.ingredients]; updated[index].quantity = e.target.value; setEditedRecipe(prev => ({ ...prev, ingredients: updated })); }} className="w-24 border rounded-md px-3 py-2" disabled={!isEditing} />
                {isEditing ? (
                  <>
                    <select value={ingredient.unit || ""} onChange={(e) => { const updated = [...editedRecipe.ingredients]; updated[index].unit = e.target.value; setEditedRecipe(prev => ({ ...prev, ingredients: updated })); }} className="w-24 border rounded-md px-2 py-2">
                      <option value="">Unit</option>
                      {unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                    <button onClick={() => setEditedRecipe(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }))} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  </>
                ) : (
                  <input type="text" value={ingredient.unit || ""} className="w-20 border rounded-md px-3 py-2 bg-gray-100" disabled />
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={() => setEditedRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "" }] }))} className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Add Ingredient</button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Preparation Time (minutes)</label>
          {isEditing ? (
            <input type="number" value={editedRecipe.preparationTime || ""} onChange={(e) => setEditedRecipe(prev => ({ ...prev, preparationTime: e.target.value }))} className="w-full border rounded-md px-4 py-2" />
          ) : (
            <p className="text-gray-700">{editedRecipe.preparationTime || "Not specified"} minutes</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Preparation Steps</label>
          {isEditing ? (
            <div className="space-y-3">
              {editedRecipe.preparationSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span>{index + 1}.</span>
                  <input type="text" value={step} onChange={(e) => { const updated = [...editedRecipe.preparationSteps]; updated[index] = e.target.value; setEditedRecipe(prev => ({ ...prev, preparationSteps: updated })); }} className="flex-1 border rounded-md px-4 py-2" />
                  <button onClick={() => setEditedRecipe(prev => ({ ...prev, preparationSteps: prev.preparationSteps.filter((_, i) => i !== index) }))} className="text-red-500">Remove</button>
                </div>
              ))}
              <button onClick={() => setEditedRecipe(prev => ({ ...prev, preparationSteps: [...prev.preparationSteps, ""] }))} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Add Step</button>
            </div>
          ) : (
            <ul className="space-y-2 list-decimal list-inside text-gray-700">
              {editedRecipe.preparationSteps.map((step, index) => <li key={index}>{step}</li>)}
            </ul>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={handleCancel} className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            <button onClick={() => saveRecipe(editedRecipe)} className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
