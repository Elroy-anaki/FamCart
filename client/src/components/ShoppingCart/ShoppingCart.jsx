import axios from "axios"; // אם תרצה להשתמש בשליחה אמיתית
import { useState } from "react";
import ShoppingItem from "./ShoppingItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notifyError, notifySuccess } from "../../lib/Toasts";

const ShoppingList = ({ cart }) => {
  const [items, setItems] = useState(cart.cartItems);
  const [inputValue, setInputValue] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [nextId, setNextId] = useState(items.length + 1);

  const {mutate: updateCartItems} = useMutation({
    mutationKey:["updateCartItems"],
    mutationFn: async() => await axios.put(`/shoppingCart/${cart._id}/items`, {items}),
    onSuccess: (data) => {
        notifySuccess("Update cart succesfully!")
        refetch()},
    onError: () => notifyError("failed to update")
  })

  const {refetch} = useQuery({
    queryKey:["getCartById"],
    queryFn: async() => {
        const {data} = await axios.get(`/shoppingCart/${cart._id}`)
        console.log(data.data.data.cartItems);

        setItems(data.data.data.cartItems)
    }, enabled: false
  })

  const handleAddItem = () => {
    if (inputValue.trim() === "") return;
    const newItem = {
      id: nextId,
      name: inputValue,
      quantity: quantityValue,
      completed: false,
    };
    setItems([...items, newItem]);
    setInputValue("");
    setQuantityValue("");
    setNextId(nextId + 1);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleToggleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };


  return (
    <div className="max-w-2xl mx-auto p-3 bg-blue-50 rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">
        {cart.cartName}
      </h2>

      <div className="mb-6 flex gap-1">
        <input
          type="text"
          placeholder="name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          className="flex-1 p-3  rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="quantity"
          value={quantityValue}
          onChange={(e) => setQuantityValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          className="w-24 p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          add
        </button>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <ShoppingItem
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">העגלה ריקה</p>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={updateCartItems}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ShoppingList;
