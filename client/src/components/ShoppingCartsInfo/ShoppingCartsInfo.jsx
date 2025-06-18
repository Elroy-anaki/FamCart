import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { HouseholdContext } from "../../context/HouseholdContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// הגדרת הסוקט (רק פעם אחת)
const socket = io("http://localhost:3000", { autoConnect: false });

export function ShoppingCartsInfo () {
  
  const { user } = useContext(AuthContext);
  const { householdInfo } = useContext(HouseholdContext);
  const navigate = useNavigate()
  
    const [cartName, setCartName] = useState("");
    const [shoppingCarts, setShoppingCarts] = useState([]);
    const [shoppingCart, setShoppingCart] = useState(null);
    const [isInputVisible, setIsInputVisible] = useState(false);
  
    const { refetch } = useQuery({
      queryKey: ["getAllShoppingCartsByHouseholdId"],
      queryFn: async () => {
        try {
          if (householdInfo) {
            const { data } = await axios.get(`/shoppingCart/${householdInfo?._id}/householdId/active`);
            setShoppingCarts(data.data);
            return data;
          }
        } catch (error) {
          console.log(error);
        }
      }
    });

    // התחברות לחדר של המשק הבית
    useEffect(() => {
      if (householdInfo?._id) {
        socket.connect(); // מתחבר רק כשצריך
        socket.emit("joinHousehold", householdInfo._id);
      }

      return () => {
        socket.disconnect(); // מנקה את החיבור כשעוזבים את הקומפוננטה
      };
    }, [householdInfo]);

    // האזנה לעדכונים על עגלות קניות
    useEffect(() => {
      const handleCartNotification = (data) => {
        if (data.type === "created") {
          notifySuccess(data.message);
          refetch(); // מעדכן את רשימת העגלות
        } else if (data.type === "deleted") {
          notifySuccess(data.message);
          refetch(); // מעדכן את רשימת העגלות
        }
      };

      socket.on("cartNotification", handleCartNotification);

      return () => {
        socket.off("cartNotification", handleCartNotification);
      };
    }, [refetch]);
  
    const addCart = async () => {
      try {
        const newCart = {
          cartName,
          cartOwner: user?._id,
          householdId: householdInfo._id
        };
        const { data } = await axios.post(`/shoppingCart/`, newCart);
        notifySuccess("Created new cart");
        setCartName(""); // Clear input after creating cart
        setIsInputVisible(false); // Hide input after creating cart
        refetch();
        
        // שליחת הודעה לכל חברי משק הבית על עגלה חדשה
        socket.emit("cartCreated", {
          householdId: householdInfo._id,
          cartId: data.data._id,
          cartName: cartName,
          createdBy: user?.name || "Unknown"
        });
      } catch (error) {
        notifyError("Creating cart");
      }
    };
  
    // Handle Enter key press in input field
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && cartName.trim()) {
        addCart();
      }
    };
  
    // Close cart selection when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        // If clicking outside the cart view area, close the selected cart
        if (shoppingCart && !event.target.closest('.cart-view-area') && 
            !event.target.closest('.cart-card')) {
          setShoppingCart(null);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [shoppingCart]);
  
    return (
      <>
   

      
        {/* Cart Management Bar */}
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
                    className={`${
                      cartName.trim() 
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
  
        {/* Main Content Area: Shopping Carts Grid + Selected Cart View */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Shopping Carts Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${shoppingCart ? '1' : '3'} gap-4 ${shoppingCart ? 'lg:w-1/3' : 'w-full'}`}>
            {shoppingCarts.length > 0 ? (
              shoppingCarts.map((cart) => (
                <div
                  key={cart._id}
                  onClick={() => navigate(`/household/shopping-cart/${cart._id}`)}
                  className={`cart-card cursor-pointer bg-white border rounded-xl p-4 transition duration-200 shadow-sm hover:shadow-md ${
                    shoppingCart?._id === cart._id
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">{cart.cartName}</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {/* This would typically show item count */}
                      New
                    </span>
                  </div>
                  <div className="mt-2 text-gray-500 text-sm">
                    {/* You could add metadata about the cart here */}
                    Created by {cart.cartOwner === user?._id ? 'you' : 'household member'}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="text-gray-400 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600">No shopping carts yet</h3>
                <p className="text-gray-500 mt-1 mb-4">Create your first shopping cart to get started</p>
                <button
                  onClick={() => setIsInputVisible(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Create Cart
                </button>
              </div>
            )}
          </div>
  
          {/* Selected Shopping Cart View */}
          {/* {shoppingCart && (
            <div className="cart-view-area lg:w-2/3 animate-fadeIn">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-green-600">{shoppingCart.cartName}</h3>
                  <button 
                    onClick={() => setShoppingCart(null)}
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <ShoppingList cart={shoppingCart} />
              </div>
            </div>
          )} */}
        </div>
        
        </>
    );
  }