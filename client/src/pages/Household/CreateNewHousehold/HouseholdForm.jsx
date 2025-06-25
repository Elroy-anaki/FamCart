import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {createHouseholdSchema} from "../../../schemas/householdSchemas"

// Days of the week excluding Saturday
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


const HouseholdForm = ({ onSubmit }) => {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-4xl font-bold text-center mb-6 text-green-700">Create a Household</h2>
      <Formik
        initialValues={{ householdName: '', householdBudget: '', householdShoppingDays: [] }}
        validationSchema={createHouseholdSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await onSubmit(values);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Household Name */}
            <div>
              <label htmlFor="householdName" className="block font-medium mb-1">Household Name</label>
              <Field
                type="text"
                name="householdName"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="householdName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Household Budget */}
            <div>
              <label htmlFor="householdBudget" className="block font-medium mb-1">Household Budget</label>
              <Field
                type="number"
                name="householdBudget"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="householdBudget" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Shopping Days */}
            <div>
              <label className="block font-medium mb-2">Shopping Days</label>
              <div className="grid grid-cols-2 gap-3">
                {daysOfWeek.map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      name="householdShoppingDays"
                      value={day}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage name="householdShoppingDays" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default HouseholdForm;
