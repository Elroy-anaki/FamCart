import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { notifySuccess, notifyError } from "../../lib/Toasts";
import { HouseholdContext } from "../../context/HouseholdContext";

export default function ShoppingCartPage() {
  const { cartId } = useParams();
  const navigate = useNavigate();
  const {householdInfo} = useContext(HouseholdContext)

  const { data, isLoading } = useQuery({
    queryKey: ["getShoppingCart", cartId],
    queryFn: async () => {
      const res = await axios.get(`/shoppingCart/${cartId}`);
      return res.data.data;
    },
  });

  const [items, setItems] = useState([]);
  const [cartName, setCartName] = useState("");
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "" });

  useEffect(() => {
    if (data) {
      setItems(data.cartItems);
      setCartName(data.cartName);
    }
  }, [data]);

  const saveChangesMutation = useMutation({
    mutationKey:["updateItmes"],
    mutationFn: async (updatedItems) => {
      await axios.put(`/shoppingCart/${cartId}/items`, {
        cartItems: updatedItems,
      });
    },
    onSuccess: () => {
      notifySuccess("Cart saved successfully");
    },
    onError: () => {
      notifyError("Failed to save cart");
    },
  });
  
  const {mutate: deleteCart} = useMutation({
    mutationKey:["deleteCart"],
    mutationFn: async () => (await axios.delete(`/shoppingCart/${householdInfo._id}/${cartId}`)),
    onSuccess: () =>{
      notifySuccess("Cart deleted");
      navigate("/household");
    },
    onError: () => {
      notifyError("Failed to delete cart");
    }
  })

  const resetItems = () => {
    setItems(data.cartItems);
  }

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    setItems([...items, { ...newItem, completed: false }]);
    setNewItem({ name: "", quantity: "", unit: "" });
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChangeItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "completed" ? value : value;
    setItems(updated);
  };

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-green-600">{cartName}</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => saveChangesMutation.mutate(items)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={deleteCart}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete Cart
          </button>
        </div>
      </div>
      <div className="mb-10 border-t pt-4">
        <h2 className="font-semibold mb-2">Add Item</h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="flex-1 border rounded px-3 py-2"
          />
          <input
            type="number"
            min={1}
            placeholder="Qty"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className="w-20 border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Unit"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            className="w-24 border rounded px-3 py-2"
          />
          <button
            onClick={handleAddItem}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center ">

        <h3 className="text-xl font-bold">Items</h3>
        <button
            onClick={resetItems}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Reset items
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2 border p-3 rounded-md">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleChangeItem(index, "name", e.target.value)}
              className="flex-1 border rounded px-2 py-1"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleChangeItem(index, "quantity", e.target.value)}
              className="w-20 border rounded px-2 py-1"
            />
            <input
              type="text"
              value={item.unit}
              onChange={(e) => handleChangeItem(index, "unit", e.target.value)}
              className="w-24 border rounded px-2 py-1"
            />
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={item.completed || false}
                onChange={(e) => handleChangeItem(index, "completed", e.target.checked)}
              />
              Completed
            </label>
            <button
              onClick={() => handleDeleteItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      
    </div>
  );
}