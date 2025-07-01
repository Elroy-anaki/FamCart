import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { HouseholdContext } from "../../context/HouseholdContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export function ShoppingCartsInfo() {
  console.log("Render---->>>");
  
  const { user } = useContext(AuthContext);
  const { householdInfo } = useContext(HouseholdContext);
  const navigate = useNavigate();

  const [cartName, setCartName] = useState("");
  const [shoppingCart, setShoppingCart] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  
  // Use ref to store socket to prevent recreation
  const socketRef = useRef(null);

  // Initialize socket only once
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000", { autoConnect: false });
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const { data: shoppingCarts = [], refetch } = useQuery({
    queryKey: ["getAllShoppingCartsByHouseholdId", householdInfo?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/shoppingCart/${householdInfo._id}/householdId/active`);
      return data.data || [];
    },
    enabled: !!householdInfo?._id,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Memoize cart notification handler to prevent recreation
  const handleCartNotification = useCallback((data) => {
    // Don't refetch if this user created the cart
    if (data.createdBy !== user?._id) {
      notifySuccess(data.message);
      refetch();
    }
  }, [refetch, user?._id]);

  // Handle Socket Connection - only when householdInfo._id changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !householdInfo?._id) return;

    if (!socket.connected) {
      socket.connect();
      socket.emit("joinHousehold", householdInfo._id);
    }

    // Listen to cart events
    socket.on("cartNotification", handleCartNotification);

    return () => {
      socket.off("cartNotification", handleCartNotification);
    };
  }, [householdInfo?._id, handleCartNotification]);

  const addCart = async () => {
    if (!cartName.trim()) return;
    
    try {
      const newCart = {
        cartName: cartName.trim(),
        cartOwner: user?._id,
        householdId: householdInfo._id
      };
      
      const { data } = await axios.post(`/shoppingCart/`, newCart);
      notifySuccess("Created new cart");
      
      // Reset form
      setCartName("");
      setIsInputVisible(false);
      
      // Refetch data
      refetch();

      // Emit socket event
      if (socketRef.current?.connected) {
        socketRef.current.emit("cartCreated", {
          householdId: householdInfo._id,
          cartId: data.data._id,
          cartName: cartName.trim(),
          createdBy: user?._id
        });
      }
    } catch (error) {
      console.error("Error creating cart:", error);
      notifyError("Failed to create cart");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && cartName.trim()) {
      addCart();
    }
  };

  // Handle click outside - memoized to prevent recreation
  const handleClickOutside = useCallback((event) => {
    if (shoppingCart && 
        !event.target.closest('.cart-view-area') &&
        !event.target.closest('.cart-card')) {
      setShoppingCart(null);
    }
  }, [shoppingCart]);

  useEffect(() => {
    if (shoppingCart) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [shoppingCart, handleClickOutside]);

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2 w-full">
          {isInputVisible ? (
            <div className="flex flex-wrap gap-10 items-center w-full max-w-md animate-fadeIn">
              <input
                type="text"
                placeholder="Enter cart name..."
                value={cartName}
                onChange={(e) => setCartName(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={15}
                autoFocus
                className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition"
              />
              <div className="flex ml-2">
                <button
                  onClick={addCart}
                  className={`${cartName.trim()
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-green-300 text-gray-100 cursor-not-allowed"
                    } px-4 py-3 rounded-lg transition flex items-center justify-center`}
                  disabled={!cartName.trim()}
                >
                  <span className="font-medium">Add</span>
                </button>
                <button
                  onClick={() => {
                    setIsInputVisible(false);
                    setCartName("");
                  }}
                  className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsInputVisible(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="font-medium">New Shopping Cart</span>
            </button>
          )}
        </div>
        <div className="text-gray-600 text-sm">
          {shoppingCarts.length} {shoppingCarts.length === 1 ? 'cart' : 'carts'} available
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${shoppingCart ? '1' : '3'} gap-4 ${shoppingCart ? 'lg:w-1/3' : 'w-full'}`}>
          {shoppingCarts.length > 0 ? (
            shoppingCarts.map((cart) => (
              <div
                key={cart._id}
                onClick={() => navigate(`/household/shopping-cart/${cart._id}`)}
                className={`cart-card cursor-pointer bg-white border rounded-xl p-4 transition duration-200 shadow-sm hover:shadow-md ${shoppingCart?._id === cart._id
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-green-300"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">{cart.cartName}</h2>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    New
                  </span>
                </div>
                <div className="mt-2 text-gray-500 text-sm">
                  Created by {cart.cartOwner === user?._id ? 'you' : 'household member'}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="text-gray-400 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600">No shopping carts yet</h3>
              <p className="text-gray-500 mt-1 mb-4">Create your first shopping cart to get started</p>
              <button
                onClick={() => setIsInputVisible(true)}
                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}