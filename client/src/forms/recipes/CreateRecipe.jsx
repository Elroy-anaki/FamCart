import React from 'react';
import CreateRecipeForm from './CreateReicpeForm'; // Fixed typo in import
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { notifySuccess, notifyError } from '../../lib/Toasts';

const CreateRecipe = () => {
  const { mutate: addRecipe } = useMutation({
    mutationKey: ['addRecipe'], 
    mutationFn: async (formData) =>
      await axios.post('/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: (data) => {
      notifySuccess('Recipe created successfully!');
      console.log('Recipe created:', data);
    },
    onError: (error) => {
      notifyError('Failed to create recipe.');
      console.error('Error creating recipe:', error.response?.data || error.message);
    },
  });

  const handleSubmit = (formData) => {
    console.log("FormData contents:");
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });
    addRecipe(formData);
  };

  return <CreateRecipeForm onSubmit={handleSubmit} />;
};

export default CreateRecipe;