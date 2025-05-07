const ShoppingItem = ({ item, onRemove, onToggleComplete }) => {
    return (
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl shadow transition-all ${
          item.completed ? 'bg-green-100 line-through text-gray-500' : 'bg-white'
        }`}
      >
        <div className="flex items-center w-full sm:w-auto">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggleComplete(item.id)}
            className="w-5 h-5 mr-3 border-2 border-green-500 text-green-600 focus:ring-green-500"
          />
          <span className="text-lg">{item.name}</span>
        </div>
  
        <div className="flex items-center mt-3 sm:mt-0 sm:ml-4">
          {item.quantity && (
            <span className="mr-3 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              {item.quantity}
            </span>
          )}
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-700 transition-colors ml-2"
            aria-label="Remove item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };
  
  export default ShoppingItem;
  