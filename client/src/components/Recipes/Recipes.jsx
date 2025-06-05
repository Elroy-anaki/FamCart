import React, { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Recipe from './Recipe';
import { HouseholdContext } from '../../context/HouseholdContext';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { notifyError } from '../../lib/Toasts';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const { householdInfo } = useContext(HouseholdContext);
  const { user } = useContext(AuthContext);

  const { mutate: myRecipes } = useMutation({
    mutationKey: ['myRecipes'],
    mutationFn: async () => (await axios.get(`/recipes/users/${user?._id}`)).data,
    onSuccess: (data) => {
      setRecipes(data.data);
    },
    onError: () => notifyError('Failed fetching recipes'),
  });

  const { mutate: householdRecipes } = useMutation({
    mutationKey: ['householdRecipes'],
    mutationFn: async () => (await axios.get(`/recipes/household/${householdInfo?._id}`)).data,
    onSuccess: (data) => setRecipes(data.data),
    onError: () => notifyError('Failed fetching recipes'),
  });

  return (
    <div className="flex flex-col items-center p-4">
      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/household/recipes/create-new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Recipe
        </Link>
        <button
          onClick={() => householdRecipes()}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Household Recipes
        </button>
        <button
          onClick={() => myRecipes()}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          My Recipes
        </button>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {recipes.map((recipe) => (
          <Recipe key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Recipes;