import React, { useContext, useState, useRef } from 'react';
import { HouseholdContext } from "../../context/HouseholdContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';

const CreateRecipeForm = ({ onSubmit = (formData) => console.log('Recipe submitted:', formData) }) => {
  const { householdInfo } = useContext(HouseholdContext);
  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const linkHouseholdRef = useRef(false);  
  const [values, setValues] = useState({
    recipeName: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    preparationSteps: '',
    preparationTime: '', 
    image: null,
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const setFieldValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    let invalidRequest = "myRecipes";
    e.preventDefault();
    setSubmitting(true);
  
    const formData = new FormData();
    formData.append('recipeName', values.recipeName);
    formData.append('createdBy', user?._id);
    if (linkHouseholdRef.current) {
      formData.append('linkedHousehold', householdInfo?._id);
      invalidRequest = "householdRecipes";
    }
    formData.append('preparationSteps', values.preparationSteps);
    formData.append('preparationTime', values.preparationTime); 
    if (values.image) {
      formData.append('image', values.image); 
    }
  
    values.ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
      formData.append(`ingredients[${index}][unit]`, ingredient.unit || '');
    });
  
    try {
      onSubmit(formData);
      // Reset form
      setValues({
        recipeName: '',
        ingredients: [{ name: '', quantity: '', unit: '' }],
        preparationSteps: '',
        preparationTime: '',
        image: null,
      });
      queryClient.invalidateQueries({ queryKey: [invalidRequest] });
    } catch (error) {
      console.error('Failed to submit recipe:', error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-4xl font-bold text-center mb-6 text-green-700">Create a Recipe</h2>

      <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Recipe Name */}
        <div>
          <label htmlFor="recipeName" className="block font-medium mb-1">
            Recipe Name
          </label>
          <input
            type="text"
            name="recipeName"
            value={values.recipeName}
            onChange={(e) => setFieldValue('recipeName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block font-medium mb-2">Ingredients</label>
          {values.ingredients.map((ingredient, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
              <div className="grid grid-cols-3 gap-3 mb-2">
                {/* Ingredient Name */}
                <div>
                  <input
                    placeholder="Name"
                    value={ingredient.name}
                    onChange={(e) => {
                      const newIngredients = [...values.ingredients];
                      newIngredients[index].name = e.target.value;
                      setFieldValue('ingredients', newIngredients);
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Ingredient Quantity */}
                <div>
                  <input
                    placeholder="Quantity"
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => {
                      const newIngredients = [...values.ingredients];
                      newIngredients[index].quantity = e.target.value;
                      setFieldValue('ingredients', newIngredients);
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Ingredient Unit */}
                <div>
                  <input
                    placeholder="Unit (optional)"
                    value={ingredient.unit}
                    onChange={(e) => {
                      const newIngredients = [...values.ingredients];
                      newIngredients[index].unit = e.target.value;
                      setFieldValue('ingredients', newIngredients);
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Remove Button */}
              {values.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newIngredients = values.ingredients.filter((_, i) => i !== index);
                    setFieldValue('ingredients', newIngredients);
                  }}
                  className="text-red-500 text-sm hover:text-red-700 transition"
                >
                  Remove Ingredient
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newIngredients = [...values.ingredients, { name: '', quantity: '', unit: '' }];
              setFieldValue('ingredients', newIngredients);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Add Ingredient
          </button>
        </div>

        {/* Preparation Steps */}
        <div>
          <label htmlFor="preparationSteps" className="block font-medium mb-1">
            Preparation Steps
          </label>
          <textarea
            name="preparationSteps"
            rows="4"
            value={values.preparationSteps}
            onChange={(e) => setFieldValue('preparationSteps', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Preparation Time */}
        <div>
          <label htmlFor="preparationTime" className="block font-medium mb-1">
            Preparation Time (minutes)
          </label>
          <input
            type="number"
            name="preparationTime"
            value={values.preparationTime || ""}
            onChange={(e) => setFieldValue("preparationTime", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required  
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block font-medium mb-1">
            Recipe Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              console.log("Selected File:", file); // Debugging: Log the selected file
              setFieldValue('image', file);
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Link Household */}
        <div>
          <button
            type="button"
            className="bg-purple-500 rounded-xl p-3 text-white cursor-pointer"
            onClick={() => (linkHouseholdRef.current = true)} // Update ref value without re-rendering
          >
            Link household
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipeForm;