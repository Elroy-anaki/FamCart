import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { notifySuccess, notifyError } from "../../lib/Toasts";
import { HouseholdContext } from "../../context/HouseholdContext";
import { io } from "socket.io-client";

// הגדרת הסוקט (רק פעם אחת)
const socket = io("http://localhost:3000", { autoConnect: false });

export default function ShoppingCartPage() {
  const { cartId } = useParams();
  const navigate = useNavigate();
  const { householdInfo } = useContext(HouseholdContext);

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["getShoppingCart", cartId],
    queryFn: async () => {
      const res = await axios.get(`/shoppingCart/${cartId}`);
      return res.data.data;
    },
    retry: false,
  });

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinHousehold", householdInfo._id);
    });

    socket.on("cartNotification", (data) => {
      notifySuccess(data.message);
      refetch()
    });

    socket.on("cartDeleted", () => {
      navigate("/household/carts-active");

    });

    return () => {
      socket.disconnect();
      socket.off("cartNotification");
      socket.off("cartDeleted");
    };
  }, [householdInfo._id, refetch]);

  useEffect(() => {
    if (error) {
      notifyError("Cart not found");
      navigate("/household/carts");
    }
  }, [error, navigate]);

  const [items, setItems] = useState([]);
  const [cartName, setCartName] = useState("");
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "" });
  const [addTotalPrice, setAddTotalPrice] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (data) {
      setItems(data.cartItems);
      setCartName(data.cartName);
      setTotalPrice(data.cartTotalPrice);
    }
  }, [data]);

  const saveChangesMutation = useMutation({
    mutationFn: async () => {
      await axios.put(`/shoppingCart/${cartId}/items`, { cartItems: items });
    },
    onSuccess: () => {
      notifySuccess("Changes saved");
      socket.emit("cartUpdated", {
        householdId: householdInfo._id,
        cartId,
      });
    },
    onError: () => notifyError("Failed to save"),
  });

  const deleteCart = useMutation({
    mutationFn: async () => {
      await axios.delete(`/shoppingCart/${householdInfo._id}/${cartId}`);
    },
    onSuccess: () => {
      notifySuccess("Cart deleted");
      socket.emit("cartDeleted", {
        householdId: householdInfo._id,
        cartId,
      });
      navigate("/household/carts-active");
    },
    onError: () => notifyError("Failed to delete cart"),
  });

  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async () => {
      await axios.put(`/shoppingCart/${cartId}/completed`, { cartTotalPrice: totalPrice });
    },
    onSuccess: () => {
      notifySuccess("Cart completed");
      navigate("/household/carts-active");
    },
    onError: () => notifyError("Completed cart failed"),
  });

  const resetItems = () => {
    setItems(data.cartItems);
  };

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

        {!data.isCompleted && (
          <div className="flex gap-2">
            <button
              onClick={() => saveChangesMutation.mutate()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => deleteCart.mutate()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Delete Cart
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center gap-2 border p-3 rounded-md"
          >
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleChangeItem(index, "name", e.target.value)}
              className="flex-1 border rounded px-2 py-1"
              disabled={data.isCompleted}
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleChangeItem(index, "quantity", e.target.value)}
              className="w-20 border rounded px-2 py-1"
              disabled={data.isCompleted}
            />
            <input
              type="text"
              value={item.unit}
              onChange={(e) => handleChangeItem(index, "unit", e.target.value)}
              className="w-24 border rounded px-2 py-1"
              disabled={data.isCompleted}
            />
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={item.completed || false}
                onChange={(e) =>
                  handleChangeItem(index, "completed", e.target.checked)
                }
                disabled={data.isCompleted}
              />
              Completed
            </label>
            {!data.isCompleted && (
              <button
                onClick={() => handleDeleteItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {!data.isCompleted ? (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="flex-1 border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="w-20 border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              className="w-24 border rounded px-2 py-1"
            />
            <button
              onClick={handleAddItem}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Add Item
            </button>
          </div>
          <button
            className="bg-green-600 cursor-pointer rounded-lg p-2 text-white mt-4"
            onClick={() => setAddTotalPrice(!addTotalPrice)}
          >
            Mark as completed
          </button>
          {addTotalPrice && (
            <div className="flex justify-start items-center gap-5 mt-3">
              <input
                className="rounded-lg border-2 border-black p-2"
                type="number"
                name="totalPrice"
                id="totalPrice"
                onChange={(e) => setTotalPrice(e.target.value)}
              />
              <button
                className="bg-green-600 cursor-pointer rounded-lg p-2 text-white"
                onClick={markAsCompleted}
              >
                Save Total Price
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-green-600">
            Total Price: ${totalPrice}
          </h2>
        </div>
      )}
    </div>
  );
}