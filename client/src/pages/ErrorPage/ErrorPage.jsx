import React from 'react';
import { BiError } from 'react-icons/bi';


const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center border-2 border-orange-200">
        <div className="flex justify-center mb-6">
          <BiError className="h-16 w-16 text-orange-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
          Our Kitchen Encountered a Small Issue
        </h1>
        
        <p className="text-gray-600 mb-4">
          As in any professional kitchen, small hiccups can happen
        </p>
        
        <p className="text-gray-600 mb-8">
          Our team is working hard to restore full service
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Main Menu
          </button>
        </div>

        <div className="mt-8 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Need assistance?
            <br />
            <a 
              href="mailto:msedetisrel@gmail.com" 
              className="text-orange-600 hover:text-orange-700 underline"
            >
              Contact our kitchen support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;