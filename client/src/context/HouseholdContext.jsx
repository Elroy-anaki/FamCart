import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const HouseholdContext = createContext(null);

// יצירת הוק נוח לשימוש בקונטקסט
export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
};

function HouseholdProvider({ children }) {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  
  const { data: householdInfo, refetch: getHouseholdInfo, isLoading, error } = useQuery({
    queryKey: ["getHouseholdInfo", user?._id], // הוספת user._id ל-queryKey
    queryFn: async () => {
      if (!user?._id) {
        return null;
      }

      try {
        const { data } = await axios.get(`/households/${user._id}`);
        return data.data;
      } catch (error) {
        console.error("Error fetching household info:", error);
        throw error; // זרוק את השגיאה כדי ש-React Query יטפל בה
      }
    },
    enabled: !!user?._id, // רק אם יש user עם _id
    staleTime: 5 * 60 * 1000, // 5 דקות
    refetchOnWindowFocus: false,
    retry: 1, // נסה שוב פעם אחת בלבד במקרה של שגיאה
  });

  // השתמש ב-useMemo כדי למנוע יצירה מחדש של האובייקט state
  const state = useMemo(() => ({
    householdInfo: householdInfo || null,
    getHouseholdInfo,
    isLoading,
    error
  }), [householdInfo, getHouseholdInfo, isLoading, error]);

  return (
    <HouseholdContext.Provider value={state}>
      {children}
    </HouseholdContext.Provider>
  );
}

export default HouseholdProvider;