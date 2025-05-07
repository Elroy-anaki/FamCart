import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "./AuthContext";

// תיקון שם הקונטקסט (הוספת האות 't')
export const HouseholdContext = createContext(null); // הוספת ערך ברירת מחדל null

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
  // בדיקה האם AuthContext קיים ואם יש לו מאפיין user
  const user = auth?.user;
  const [householdInfo, setHouseholdInfo] = useState(null);
  
  const { refetch: getHouseholdInfo } = useQuery({
    queryKey: ["getHouseholdInfo"],
    queryFn: async () => {
      if (!user) {
        console.log("No user");
        return null;
      }

      try {
        const { data } = await axios.get(`/households/${user._id}`);
        console.log(data);
        setHouseholdInfo(data.data);
        return data.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: false, 
  });

  useEffect(() => {
    if (user) {
      getHouseholdInfo();
    }
  }, [user]);

  const state = {
    householdInfo,
    getHouseholdInfo,
  };

  return (
    <HouseholdContext.Provider value={state}>
      {children}
    </HouseholdContext.Provider>
  );
}

export default HouseholdProvider;