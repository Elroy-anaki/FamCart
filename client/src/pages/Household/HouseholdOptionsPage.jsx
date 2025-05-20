import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinHousehold from "../../modals/JoinHousehold"; 
import axios from "axios"
import {AuthContext} from "../../context/AuthContext"
import { notifyError, notifySuccess } from "../../lib/Toasts";
import { useQueryClient } from "@tanstack/react-query";

export default function HouseholdOptionsPage() {

  const queryClient = useQueryClient()
    const {user, isAuth} = useContext(AuthContext)
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");

  const handleJoin = async() => {
    try {
      if(!isAuth){
        notifyError("Sign in before...")
        navigate("/auth/sign-in")
        return
      }
      const req = {userId: user?._id, joinCode: code}
      const {data} = await axios.post("/households/join", req)
      notifySuccess(`Welcome to the ${data.data.householdName}`)
      queryClient.invalidateQueries({queryKey: ["getHouseholdInfo"]})
      setCode("")
    } catch (error) {
      notifyError("failed join code")
    }
    setIsOpen(false);
  };
    return (
        <div className="flex flex-col justify-center mt-6 md:mt-10 gap-10 md:gap-20 px-4 md:px-0">
          <div className="flex flex-col gap-4 md:gap-8 items-center text-center">
            <h1 className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Welcome to FamCart</h1>
            <h2 className="text-black text-xl sm:text-2xl md:text-3xl">What Do You Want To Do?</h2>
          </div>
    
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto h-auto md:h-[50vh] flex flex-col sm:flex-row justify-center">
            <div
              className="bg-green-600 w-full sm:w-1/2 py-8 md:py-0 md:h-1/3 flex justify-center items-center rounded-t-xl sm:rounded-t-none sm:rounded-l-xl cursor-pointer hover:bg-green-400 transition-colors duration-300"
              onClick={() => navigate("/household/create-new")}
            >
              <h3 className="text-white text-lg sm:text-xl px-4 text-center">Create a new household</h3>
            </div>
    
            <div
              className="bg-blue-700 w-full sm:w-1/2 py-8 md:py-0 md:h-1/3 flex justify-center items-center rounded-b-xl sm:rounded-b-none sm:rounded-r-xl cursor-pointer hover:bg-blue-400 transition-colors duration-300"
              onClick={() => setIsOpen(true)}
            >
              <h3 className="text-white text-lg sm:text-xl px-4 text-center">Join existing household</h3>
            </div>
          </div>
    
          {/* הזרקת המודל */}
          <JoinHousehold isOpen={isOpen} setIsOpen={setIsOpen} code={code} setCode={setCode} onJoin={handleJoin} />
        </div>
      );
    }
