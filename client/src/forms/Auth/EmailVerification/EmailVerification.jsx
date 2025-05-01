
import React, { useContext} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'

function EmailVerification() {

    const navigate = useNavigate();
    const { userId } = useParams();
    const {verifyEmail} = useContext(AuthContext)

    return (
        <div className="flex flex-col items-center h-screen pt-10  text-white">
            <h1 className="text-5xl text-center font-bold mb-8 text-black">
                Click the Button Below to Verify Your Email
            </h1>
            <button
                onClick={() => {
                    verifyEmail(userId);
                    navigate('/auth/sign-in')
                }}
                className="bg-green-500 text-black font-medium px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md"
            >
                Verify Email
            </button>
        </div>

    )
}

export default EmailVerification
