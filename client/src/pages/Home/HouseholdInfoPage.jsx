import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { HouseholdContext } from "../../context/HouseholdContext";
import axios from "axios";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { useQuery } from "@tanstack/react-query";
import ShoppingList from "../../components/ShoppingCart/ShoppingCart";

export default function HouseholdInfoPage() {
  const { user } = useContext(AuthContext);
  const { householdInfo } = useContext(HouseholdContext);

  const [cartName, setCartName] = useState("");
  const [openInputText, setOpneInputText] = useState(false);
  const [shoppingCarts, setShoppingCarts] = useState([]);
  const [shoppingCart, setShoppingCart] = useState(null);

  const { refetch } = useQuery({
    queryKey: ["getAllShoppingCartsByHouseholdId"],
    queryFn: async () => {
      try {
        if (householdInfo) {
          const { data } = await axios.get(`/shoppingCart/${householdInfo?._id}/householdId`);
          setShoppingCarts(data.data);
          return data;
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  const addCart = async () => {
    try {
      const newCart = {
        cartName,
        cartOwner: user?._id,
        householdId: householdInfo._id
      };
      const { data } = await axios.post(`/shoppingCart/`, newCart);
      notifySuccess("Created new cart");
      setCartName("");
      setOpneInputText(false);
      refetch();
    } catch (error) {
      notifyError("Creating cart");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setOpneInputText(!openInputText)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {openInputText ? "Cancel" : "Add Cart"}
        </button>

        {openInputText && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cart Name"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              className="bg-green-100 border border-green-400 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={addCart}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              +
            </button>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {shoppingCarts.map((cart) => (
          <div
            key={cart._id}
            onClick={() => setShoppingCart(cart)}
            className="cursor-pointer bg-white border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition shadow"
          >
            <h2 className="text-xl font-semibold text-blue-700">{cart.cartName}</h2>
          </div>
        ))}
      </div>

      {shoppingCart && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Cart: {shoppingCart.cartName}</h3>
          <ShoppingList cart={shoppingCart} />
        </div>
      )}
    </div>
  );
}
