import React from 'react';
import { Link, useNavigate, useSearchParams } from "react-router";
import axios from 'axios';
import { useMutation } from '@tanstack/react-query'
import { notifyError, notifySuccess } from '../../../lib/Toasts.jsx';


function ResetPassword() {
  
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);

  const { mutate: resetPassword } = useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: async (e) => {
      e.preventDefault()
      const { newPassword } = e.target;
      const userId = queryParams.get("userId")
      const forgotPasswordId = queryParams.get("forgotPasswordId")
      const { data } = await axios.post(`/auth/reset-password?userId=${userId}&forgotPasswordId=${forgotPasswordId}`, { password: newPassword.value, premission: 'user' })
      return data;
    },
    onSuccess: (data) => {
      notifySuccess(data.msg);
      navigate('/auth/sign-in')
     },
     onError: (data) => {
      notifyError(data.msg)
    }
  })

  return (
    <div className="font-sans  min-h-screen flex items-start justify-center w-full p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-sky-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
        </div>

        <form
          onSubmit={resetPassword}
          className="p-8 space-y-6"
        >
          <div className="space-y-2 relative">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-700"
              >
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white py-3 rounded-lg hover:bg-sky-800 transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-md"
          >
            Reset Password
          </button>
        </form>

      </div>
    </div>
  )
}

export default ResetPassword
