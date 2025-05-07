import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

function Home() {
  return (
    <div className="flex flex-col justify-center mt-6 md:mt-10 gap-10 md:gap-20 px-4 md:px-0">
      <div className="flex flex-col gap-4 md:gap-8 items-center text-center">
        <h1 className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Welcome to FamCart</h1>
        <h2 className="text-black text-xl sm:text-2xl md:text-3xl">What Do You Want To Do?</h2>
      </div>
      
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto h-auto md:h-[50vh] flex flex-col sm:flex-row justify-center">
        <div className="bg-green-600 w-full sm:w-1/2 py-8 md:py-0 md:h-1/3 flex justify-center items-center rounded-t-xl sm:rounded-t-none sm:rounded-l-xl cursor-pointer hover:bg-green-400 transition-colors duration-300">
          <h3 className="text-white text-lg sm:text-xl px-4 text-center">Create a new household</h3>
        </div>
        
        <div className="bg-blue-700 w-full sm:w-1/2 py-8 md:py-0 md:h-1/3 flex justify-center items-center rounded-b-xl sm:rounded-b-none sm:rounded-r-xl cursor-pointer hover:bg-blue-400 transition-colors duration-300">
          <h3 className="text-white text-lg sm:text-xl px-4 text-center">Joining to existing household</h3>
        </div>
      </div>
    </div>
  );
}

export default Home;