import React, { useContext, useState } from 'react';
import { HouseholdContext } from "../../context/HouseholdContext";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from '@tanstack/react-query';
import {unitOptions} from "../../constants/index"

const CreateRecipeForm = ({ onSubmit = (formData) => console.log('Recipe submitted:', formData) }) => {

  // Contexts
  const { householdInfo } = useContext(HouseholdContext);
  const { user } = useContext(AuthContext);

  // Hooks
  const queryClient = useQueryClient();

  // States
  const [linkHousehold, setLinkHousehold] = useState(false); // Changed from ref to state
  const [values, setValues] = useState({
    recipeName: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    preparationSteps: [''], // Changed to array of strings
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
    if (linkHousehold) {
      formData.append('linkedHousehold', householdInfo?._id);
      invalidRequest = "householdRecipes";
    }
    
    // Join preparation steps with newlines or send as array - depends on your backend
    formData.append('preparationSteps', JSON.stringify(values.preparationSteps));    formData.append('preparationTime', values.preparationTime); 
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
        preparationSteps: [''],
        preparationTime: '',
        image: null,
      });
      setLinkHousehold(false);
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
                  <select
                    value={ingredient.unit}
                    onChange={(e) => {
                      const newIngredients = [...values.ingredients];
                      newIngredients[index].unit = e.target.value;
                      setFieldValue('ingredients', newIngredients);
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Unit</option>
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
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
          <label className="block font-medium mb-2">Preparation Steps</label>
          {values.preparationSteps.map((step, index) => (
            <div key={index} className="mb-3">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 mt-3 min-w-[20px]">{index + 1}.</span>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => {
                      const newSteps = [...values.preparationSteps];
                      newSteps[index] = e.target.value;
                      setFieldValue('preparationSteps', newSteps);
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {values.preparationSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newSteps = values.preparationSteps.filter((_, i) => i !== index);
                      setFieldValue('preparationSteps', newSteps);
                    }}
                    className="text-red-500 text-sm hover:text-red-700 transition mt-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newSteps = [...values.preparationSteps, ''];
              setFieldValue('preparationSteps', newSteps);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Add Step
          </button>
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
              console.log("Selected File:", file);
              setFieldValue('image', file);
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Link Household - Improved Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-gray-700 font-medium block">Link to Household</span>
            <span className="text-sm text-gray-500">
              {linkHousehold ? "Recipe will be shared with household members" : "Recipe will be private"}
            </span>
          </div>
          <button
            type="button"
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              linkHousehold ? "bg-purple-600" : "bg-gray-300"
            }`}
            onClick={() => {
              setLinkHousehold(!linkHousehold);
              console.log("Link Household:", !linkHousehold);
            }}
            aria-pressed={linkHousehold}
            aria-label="Toggle household linking"
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                linkHousehold ? "translate-x-6" : "translate-x-1"
              }`}
            />
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

export default CreateRecipeForm