import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { notifySuccess, notifyError } from "../../lib/Toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext); // להוסיף setUser לעדכון המשתמש
  const [canSave, setCanSave] = useState(true);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    userName: user.userName,
    userEmail: user.userEmail,
  });

  const { mutateAsync: editUserDetails } = useMutation({
    mutationKey: ["editUserDetails"],
    mutationFn: async () => {
      const response = await axios.put(`/users/edit-user-details/${user._id}`, formData);
      return response.data;
    },
    onSuccess: async () => {
      notifySuccess("הפרופיל עודכן בהצלחה!");
      queryClient.invalidateQueries({ queryKey: ["verifyToken"] });

      // לרענן את הטוקן לאחר עדכון פרטי המשתמש
      try {
        const tokenResponse = await axios.post("/auth/refresh-token", { userId: user._id });
        console.log(tokenResponse.data.data)
        setUser(tokenResponse.data.data)
      } catch (error) {
        console.error("נכשל ברענון הטוקן:", error);
      }
    },
    onError: () => notifyError("עדכון הפרופיל נכשל."),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setCanSave(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUserDetails();
    } catch (error) {
      console.error("שגיאה בעדכון הפרופיל:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ערוך פרופיל</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
              שם
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-lg p-3"
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
              אימייל
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              disabled
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-lg p-3 bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="verify" className="block text-sm font-medium text-gray-700">
              מאומת
            </label>
            <input
              type="text"
              id="verify"
              name="verify"
              value={user.verify ? "כן" : "לא"}
              disabled
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 text-lg p-3"
            />
          </div>
          <div>
            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
              נוצר ב-
            </label>
            <input
              type="text"
              id="createdAt"
              name="createdAt"
              value={new Date(user.createdAt).toLocaleString()}
              disabled
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 text-lg p-3"
            />
          </div>
          <div>
            <label htmlFor="updatedAt" className="block text-sm font-medium text-gray-700">
              עודכן ב-
            </label>
            <input
              type="text"
              id="updatedAt"
              name="updatedAt"
              value={new Date(user.updatedAt).toLocaleString()}
              disabled
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 text-lg p-3"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            disabled={canSave}
            type="submit"
            className={`${canSave ? "bg-gray-200" : "bg-green-600 hover:bg-green-500"} text-white py-3 px-6 rounded-lg transition duration-300 text-lg cursor-pointer`}
          >
            שמור שינויים
          </button>
        </div>
      </form>
    </div>
  );
}
