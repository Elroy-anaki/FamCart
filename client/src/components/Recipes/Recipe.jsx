import React from 'react';
import { useNavigate } from 'react-router-dom';

const Recipe = ({ recipe }) => {
  const navigate = useNavigate()
  if (!recipe) {
    return <p>No recipe data available.</p>;
  }

  const { _id, recipeName, ingredients, preparationSteps, image, createdBy, linkedHousehold } = recipe;

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded-lg flex flex-col items-center" onClick={() => navigate(`/household/recipes/${_id}`)}>
      {/* Recipe Image */}
      <div className="mb-4 w-full h-64 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
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
      <p className="w-fit text-white px-3 py-1 rounded-lg bg-purple-700 text-sm">
        Recipe Type: {linkedHousehold ? 'Public' : 'Private'}
      </p>
    </div>
  );
};

export default Recipe;