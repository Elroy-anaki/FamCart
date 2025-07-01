import * as Yup from 'yup';

export const createHouseholdSchema = Yup.object().shape({
  householdName: Yup.string()
    .required('שם המשפחה/בית הוא שדה חובה'),
  householdBudget: Yup.number()
    .typeError('התקציב חייב להיות מספר')
    .positive('התקציב חייב להיות מספר חיובי')
    .required('התקציב הוא שדה חובה'),
  householdShoppingDays: Yup.array()
    .min(1, 'בחר לפחות יום קנייה אחד'),
});
