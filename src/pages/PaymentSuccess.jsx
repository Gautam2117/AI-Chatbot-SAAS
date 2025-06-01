import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = location.state || {};

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/verify-payment`,
          { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        );

        if (response.data.success) {
          setVerified(true);
        } else {
          alert("❌ Payment verification failed. Please contact support.");
          navigate("/");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        alert("❌ Verification failed. Please try again or contact support.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (razorpay_payment_id) {
      verifyPayment();
    } else {
      alert("❌ Missing payment details. Redirecting...");
      navigate("/");
    }
  }, [razorpay_payment_id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-100 p-6">
      <div className="relative bg-white bg-opacity-30 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-10 text-center transition-all duration-500 ease-in-out animate-fadeIn">
        {loading ? (
          <div>
            <div className="w-20 h-20 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-xl text-indigo-700 font-bold animate-pulse">Verifying Payment...</p>
          </div>
        ) : verified ? (
          <>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <h1 className="text-4xl font-extrabold text-green-700 mb-4 drop-shadow-lg">
              🎉 Payment Verified!
            </h1>
            <p className="text-lg text-gray-800 mb-4">
              Your premium access has been successfully activated. Enjoy the new features!
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              🚀 Go to Dashboard
            </button>
          </>
        ) : (
          <p className="text-red-600 text-lg font-semibold">❌ Payment verification failed.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
