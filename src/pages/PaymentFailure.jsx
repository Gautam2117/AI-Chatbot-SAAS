import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-200 to-red-300 flex items-center justify-center p-8">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full space-y-6 text-center">
        <div className="flex items-center justify-center">
          <FaExclamationTriangle className="text-red-600 text-5xl drop-shadow-lg" />
        </div>
        <h1 className="text-4xl font-extrabold text-red-700 drop-shadow">❌ Payment Failed!</h1>
        <p className="text-lg text-gray-800">
          Unfortunately, your payment could not be processed.
        </p>
        <p className="text-sm text-gray-600">
          Please check your payment details and try again. If the issue persists, contact our support team at <a href="mailto:botify.assist@gmail.com" className="text-red-600 underline hover:text-red-800">botify.assist@gmail.com</a>.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-red-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          🔙 Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;
