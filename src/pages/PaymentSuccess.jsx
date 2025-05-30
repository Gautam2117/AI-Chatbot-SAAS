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
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/verify-payment`, {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-blue-200 to-pink-300 p-6">
      <div className="relative bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
        {loading ? (
          <div>
            <div className="w-20 h-20 border-4 border-dashed rounded-full border-pink-500 animate-spin mx-auto" />
            <p className="mt-4 text-lg text-indigo-700 font-semibold">Verifying Payment...</p>
          </div>
        ) : verified ? (
          <>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <h1 className="text-4xl font-bold text-green-700 mb-4">🎉 Payment Verified!</h1>
            <p className="text-lg text-gray-800">Your premium access has been activated.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform"
            >
              🚀 Go to Dashboard
            </button>
          </>
        ) : (
          <p className="text-red-600 text-lg font-semibold">Payment verification failed.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
