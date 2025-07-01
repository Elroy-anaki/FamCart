import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HouseholdContext } from "../../context/HouseholdContext";
import { notifyError, notifySuccess } from "../../lib/Toasts";

export default function CartsHistory() {

  // Contexts
  const { householdInfo, getHouseholdInfo } = useContext(HouseholdContext);

  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getCartsHistory"],
    queryFn: async () => {
      const response = await axios.get(`/shoppingCart/${householdInfo._id}/history`);
      return response.data.data;
    },
  });

  const { mutate: reopenCart } = useMutation({
    mutationKey: ["reopenCart"],
    mutationFn: async (cartId) => {
      await axios.post(`/shoppingCart/${cartId}/reopen`);
    },
    onSuccess: () => {
      notifySuccess("העגלה נפתחה מחדש");
      queryClient.invalidateQueries({ queryKey: ["getCartsHistory", "getHouseholdInfo"] });
      getHouseholdInfo()
    },
    onError: () => notifyError("נכשל לפתוח מחדש את העגלה"),
  });

  if (isLoading) {
    return <div className="text-center text-gray-600">טוען...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-600">שגיאה בטעינת היסטוריית העגלות</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">היסטוריית עגלות הקניות</h1>
      <h2 className="text-lg font-medium text-gray-600 mb-6 text-center">
        סכום כולל: <span className="text-green-600 font-semibold">₪{data.totalPrice.toFixed(2)}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.cartsHistory.length > 0 ? (
          data.cartsHistory.map((cart) => (
            <div
              key={cart._id}
              className="cart-card bg-white border rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{cart.cartName}</h2>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  סגורה
                </span>
              </div>
              <div className="text-gray-500 text-sm mb-4">
                נוצרה על ידי <span className="font-medium">{cart.cartOwner}</span>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => reopenCart(cart._id)}
                  className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  פתח מחדש
                </button>
                <button
                  onClick={() => navigate(`/household/shopping-cart/₪{cart._id}`)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm font-medium transition"
                >
                  לצפייה בפרטים
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="text-gray-400 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600">אין עגלות בהיסטוריה</h3>
            <p className="text-gray-500 mt-1 mb-4">היסטוריית עגלות הקניות שלך תופיע כאן</p>
          </div>
        )}
      </div>
    </div>
  );
}
