import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifyError, notifySuccess } from "../../lib/Toasts";

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({
    recipeName: "",
    image: "",
    ingredients: [],
    preparationSteps: "",
    preparationTime: ""
  });

  // Fetch recipe data using react-query
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ["getRecipe", id],
    queryFn: async () => {
      const response = await axios.get(`/recipes/${id}`);
      return response.data.data;
    },
    enabled: !!id, // Only run query if id exists
  });

  // Initialize editedRecipe when recipe data is loaded
  useEffect(() => {
    if (recipe) {
      setEditedRecipe({
        recipeName: recipe.recipeName || "",
        image: recipe.image || "",
        ingredients: recipe.ingredients || [],
        preparationSteps: recipe.preparationSteps || "",
        preparationTime: recipe.preparationTime || ""
      });
    }
  }, [recipe]);

  // Mutation to save the updated recipe
  const { mutate: saveRecipe, isLoading: isSaving } = useMutation({
    mutationFn: async (updatedRecipe) => {
      await axios.put(`/recipes/update-all-recipe/${id}`, updatedRecipe);
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["getRecipe", id] });
      alert("Recipe updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    },
  });

  // Mutation to delete the recipe
  const { mutate: deleteRecipe, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/recipes/${id}`);
    },
    onSuccess: () => {
    notifySuccess("Recipe deleted successfully!");
      navigate("/household/recipes"); // Redirect to recipes list
    },
    onError: (error) => {
      console.error("Error deleting recipe:", error);
      notifyError("Failed to delete recipe. Please try again.");
    },
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading recipe...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        Failed to load recipe. Please try again later.
      </p>
    );
  }

  const handleCancel = () => {
    if (recipe) {
      setEditedRecipe({
        recipeName: recipe.recipeName || "",
        image: recipe.image || "",
        ingredients: recipe.ingredients || [],
        preparationSteps: recipe.preparationSteps || "",
        preparationTime: recipe.preparationTime || ""
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 flex-1">
          {editedRecipe.recipeName || "Recipe Name"}
        </h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={isEditing || isDeleting}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => deleteRecipe()}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Recipe Image */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700">Recipe Image</label>
        {isEditing ? (
          <input
            type="file"
            onChange={(e) => setEditedRecipe((prev) => ({ ...prev, image: e.target.files[0] }))}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
            {editedRecipe.image ? (
              <img
                src={editedRecipe.image}
                alt={editedRecipe.recipeName || "Recipe"}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500 text-sm">No Image Available</p>
            )}
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700">Ingredients</label>
        {editedRecipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-4 mb-2 items-center">
            <input
              type="text"
              placeholder="Name"
              value={ingredient.name || ""}
              onChange={(e) =>
                setEditedRecipe((prev) => {
                  const updatedIngredients = [...prev.ingredients];
                  updatedIngredients[index].name = e.target.value;
                  return { ...prev, ingredients: updatedIngredients };
                })
              }
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ingredient.quantity || ""}
              onChange={(e) =>
                setEditedRecipe((prev) => {
                  const updatedIngredients = [...prev.ingredients];
                  updatedIngredients[index].quantity = e.target.value;
                  return { ...prev, ingredients: updatedIngredients };
                })
              }
              className="w-24 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />
            <input
              type="text"
              placeholder="Unit"
              value={ingredient.unit || ""}
              onChange={(e) =>
                setEditedRecipe((prev) => {
                  const updatedIngredients = [...prev.ingredients];
                  updatedIngredients[index].unit = e.target.value;
                  return { ...prev, ingredients: updatedIngredients };
                })
              }
              className="w-24 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>

      {/* Preparation Steps */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700">Preparation Steps</label>
        <textarea
          value={editedRecipe.preparationSteps || ""}
          onChange={(e) =>
            setEditedRecipe((prev) => ({ ...prev, preparationSteps: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          disabled={!isEditing}
        />
      </div>

      {/* Preparation Time */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700">Preparation Time (minutes)</label>
        <input
          type="number"
          value={editedRecipe.preparationTime || ""}
          onChange={(e) =>
            setEditedRecipe((prev) => ({ ...prev, preparationTime: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
      </div>

      {/* Save and Cancel Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => saveRecipe(editedRecipe)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipePage;