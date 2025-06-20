
import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Recipe from './Recipe';
import { HouseholdContext } from '../../context/HouseholdContext';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { notifyError } from '../../lib/Toasts';

const Recipes = () => {

  // Contexts
  const { householdInfo } = useContext(HouseholdContext);
  const { user } = useContext(AuthContext);

  // States
  const [activeView, setActiveView] = useState('household'); 

  // Quereis - for fetch all recipes (private and public)
  const { 
    data: householdRecipesData, 
    isLoading: isLoadingHousehold,
    error: householdError 
  } = useQuery({
    queryKey: ['householdRecipes', householdInfo?._id],
    queryFn: async () => {
      const response = await axios.get(`/recipes/household/${householdInfo?._id}`);
      return response.data;
    },
    enabled: !!householdInfo?._id && activeView === 'household',
    onError: () => notifyError('Failed fetching household recipes'),
  });

  const { 
    data: myRecipesData, 
    isLoading: isLoadingMy,
    error: myError 
  } = useQuery({
    queryKey: ['myRecipes', user?._id],
    queryFn: async () => {
      const response = await axios.get(`/recipes/users/${user?._id}`);
      return response.data;
    },
    enabled: !!user?._id && activeView === 'my',
    onError: () => notifyError('Failed fetching my recipes'),
  });

  // קביעת הנתונים הנוכחיים
  const currentRecipes = activeView === 'household' 
    ? householdRecipesData?.data || [] 
    : myRecipesData?.data || [];
    
  const isLoading = activeView === 'household' ? isLoadingHousehold : isLoadingMy;

  return (
    <div className="flex flex-col items-center p-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <Link
          to="/household/recipes/create-new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Recipe
        </Link>
        <button
          onClick={() => setActiveView('household')}
          className={`px-4 py-2 rounded-md transition ${
            activeView === 'household'
              ? 'bg-green-700 text-white'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Household Recipes
        </button>
        <button
          onClick={() => setActiveView('my')}
          className={`px-4 py-2 rounded-md transition ${
            activeView === 'my'
              ? 'bg-purple-700 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          My Recipes
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-500 py-8">
          Loading recipes...
        </div>
      )}

      {/* Error State */}
      {(householdError || myError) && (
        <div className="text-center text-red-500 py-8">
          Failed to load recipes. Please try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && currentRecipes.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No recipes found. {activeView === 'household' ? 'Add some recipes to your household!' : 'Create your first recipe!'}
        </div>
      )}

      {/* Recipes Grid */}
{!isLoading && currentRecipes.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-5xl">
    {currentRecipes.map((recipe) => (
      <Recipe
        key={recipe._id}
        recipe={recipe}
        className="p-4 border rounded-md shadow-sm hover:shadow-md transition transform hover:scale-105"
      />
    ))}
  </div>
)}
    </div>
  );
};

export default Recipes;