import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { notifyError, notifySuccess } from '../../lib/Toasts';

const Recipe = ({ recipe }) => {

  // Hooks
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Queries
  const { mutate: deleteRecipe } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/recipes/${recipe._id}`);
    },
    onSuccess: () => {
      notifySuccess("Recipe deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['householdRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['myRecipes'] });
    },
    onError: (error) => {
      console.error("Error deleting recipe:", error);
      notifyError("Failed to delete recipe. Please try again.");
    },
  });

  if (!recipe) {
    return <p>No recipe data available.</p>;
  }

  const { _id, recipeName, image, createdBy, linkedHousehold } = recipe;

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
      {/* Recipe Image */}
      <div 
        className="mb-4 w-full h-32 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" 
        onClick={() => navigate(`/household/recipes/${_id}`)}
      >
        {image ? (
          <img
            src={image}
            alt={recipeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-500 text-sm">No Image Available</p>
        )}
      </div>
  
      {/* Recipe Name */}
      <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">{recipeName}</h1>
  
      {/* Created By */}
      {createdBy && (
        <div className="text-sm text-gray-500 mb-2">
          <p>Created by: {createdBy.userName || 'Unknown'}</p>
        </div>
      )}
  
      {/* Recipe Type */}
      <p className="w-3/4 text-center text-white px-3 py-1 rounded-lg bg-purple-700 text-sm mb-2">
        Recipe Type: {linkedHousehold ? 'Public' : 'Private'}
      </p>
      
      <button 
        onClick={() => deleteRecipe()} 
        className="w-3/4 cursor-pointer text-white px-3 py-1 rounded-lg bg-rose-700 text-sm hover:bg-rose-800 transition-colors"
      >
        Delete
      </button>
    </div>
  );
};

export default Recipe;