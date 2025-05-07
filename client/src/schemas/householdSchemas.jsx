import * as Yup from 'yup';


export const createHouseholdSchema = Yup.object().shape({
  householdName: Yup.string()
    .required('Household name is required'),
  householdBudget: Yup.number()
    .typeError('Budget must be a number')
    .positive('Budget must be a positive number')
    .required('Household budget is required'),
  shoppingDays: Yup.array()
    .min(1, 'Select at least one shopping day'),
});