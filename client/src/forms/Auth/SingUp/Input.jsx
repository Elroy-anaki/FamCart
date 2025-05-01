import { ErrorMessage } from 'formik'
import React from 'react'

function Input({ label,Icon, FaEye,FaEyeSlash,showPassword,setShowPassword, ...props }) {

    

    return (
        <div>
            <label htmlFor={props.name}
                className="text-gray-700 text-sm font-medium block mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                type={props.type}
                    {...props}
                    className="w-full bg-white/50 text-gray-800 border border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                />
                <Icon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                { FaEye && (
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none p-0"
                  >
                    {showPassword 
                    ? (<FaEyeSlash className="w-5 h-5 text-gray-400" />)
                    : (<FaEye className="w-5 h-5 text-gray-400" />)
                      }
                  </button>
                )}
                <ErrorMessage name={props.name}>
                     {(msg) => (
                    <div className='mt-1'>
                        <p className="text-red-500 text-sm mt-1">{msg}</p>
                    </div>
                )}
                </ErrorMessage>
            </div>
        </div>
    )
}

export default Input
