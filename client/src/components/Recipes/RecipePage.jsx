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
    preparationSteps: [],
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
        preparationSteps: recipe.preparationSteps || [],
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
      notifySuccess("Recipe updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating recipe:", error);
      notifyError("Failed to update recipe. Please try again.");
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
    return <p className="text-center text-gray-500 p-4">Loading recipe...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 p-4">
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg mt-4 sm:mt-10 relative">
      {/* Header with Recipe Name */}
      <div className="mb-6">
        {isEditing ? (
          <input
            type="text"
            value={editedRecipe.recipeName || ""}
            onChange={(e) =>
              setEditedRecipe((prev) => ({ ...prev, recipeName: e.target.value }))
            }
            className="w-full text-2xl sm:text-4xl font-bold text-center text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter recipe name"
          />
        ) : (
          <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 break-words">
            {editedRecipe.recipeName || "Recipe Name"}
          </h1>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          disabled={isEditing || isDeleting}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteRecipe()}
          className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Recipe Image */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">Recipe Image</label>
        {isEditing ? (
          <input
            type="file"
            onChange={(e) => setEditedRecipe((prev) => ({ ...prev, image: e.target.files[0] }))}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
        ) : (
          <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
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
        <label className="block text-lg font-semibold text-gray-700 mb-2">Ingredients</label>
        <div className="space-y-3">
          {editedRecipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 bg-gray-50 rounded-md">
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
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isEditing}
              />
              <div className="flex gap-2">
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
                  className="w-20 sm:w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-16 sm:w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preparation Time */}
<div className="mb-6">
  <label className="block text-lg font-semibold text-gray-700 mb-2">Preparation Time (minutes)</label>
  {isEditing ? (
    <input
      type="number"
      value={editedRecipe.preparationTime || ""}
      onChange={(e) =>
        setEditedRecipe((prev) => ({
          ...prev,
          preparationTime: e.target.value,
        }))
      }
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter preparation time"
    />
  ) : (
    <p className="text-gray-700">{editedRecipe.preparationTime || "Not specified"} minutes</p>
  )}
</div>

      {/* Preparation Steps */}
<div className="mb-6">
  <label className="block text-lg font-semibold text-gray-700 mb-2">Preparation Steps</label>
  {isEditing ? (
    <div className="space-y-3">
      {editedRecipe.preparationSteps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-gray-500 font-medium">{index + 1}.</span>
          <input
            type="text"
            value={step}
            onChange={(e) =>
              setEditedRecipe((prev) => {
                const updatedSteps = [...prev.preparationSteps];
                updatedSteps[index] = e.target.value;
                return { ...prev, preparationSteps: updatedSteps };
              })
            }
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Step ${index + 1}`}
          />
          <button
            type="button"
            onClick={() =>
              setEditedRecipe((prev) => ({
                ...prev,
                preparationSteps: prev.preparationSteps.filter((_, i) => i !== index),
              }))
            }
            className="text-red-500 hover:text-red-700 transition"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setEditedRecipe((prev) => ({
            ...prev,
            preparationSteps: [...prev.preparationSteps, ""],
          }))
        }
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
      >
        Add Step
      </button>
    </div>
  ) : (
    <div className="space-y-3">
      {editedRecipe.preparationSteps.map((step, index) => (
        <div key={index} className="flex items-start gap-3">
          <span className="text-gray-500 font-medium">{index + 1}.</span>
          <p className="flex-1 text-gray-700">{step}</p>
        </div>
      ))}
    </div>
  )}
</div>

      {/* Save and Cancel Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => saveRecipe(editedRecipe)}
            className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
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